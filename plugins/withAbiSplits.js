const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('splits {')) {
      return config;
    }

    const splitsBlock = `
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86_64'
            universalApk false
        }
    }

    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            def versionCodes = ['armeabi-v7a': 1, 'arm64-v8a': 2, 'x86_64': 3]
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            if (abi == null) return
            output.versionCodeOverride = variant.versionCode * 1000 + versionCodes.get(abi, 0)
        }
    }
`;

    config.modResults.contents = config.modResults.contents.replace(
      'android {',
      'android {' + splitsBlock
    );

    return config;
  });
};
