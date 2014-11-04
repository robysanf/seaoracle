module.exports = function(grunt) {

	var target = grunt.option('target');
	grunt.log.write('Deploying on ' + target);

  grunt.initConfig({
  
    aws: grunt.file.readJSON('aws-keys-' + target + '.json'), //aws-keys-production.json o aws-keys-test.json
    s3: {
      options: {
        key: '<%= aws.AWSAccessKeyId %>',
        secret: '<%= aws.AWSSecretKey %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public",
		  "x-amz-meta-mode": "33188",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      deploy: {
        upload: [
          {
            src: 'dist/index.html',
            dest: 'index.html',
            options: {
              headers: {
                // 1 minute cache policy (1000 * 60)
                "Cache-Control": "max-age=60000, public",
				"x-amz-meta-mode": "33188",
                "Expires": new Date(Date.now() + 60000).toUTCString()
              }
            }
          },
          {
            src: 'dist/assets/*',
            dest: 'assets/'
          },
          {
            src: 'dist/fonts/*',
            dest: 'fonts/'
          },
          {
            src: 'dist/img/*',
            dest: 'img/'
          }
        ]
      }
    } // end s3
}); // end grunt.initConfig

  grunt.loadNpmTasks('grunt-s3');

  // Deploy task(s).
    //ember build --environment production
  //grunt deploy --target=test
  grunt.registerTask('deploy', ['s3']);

};