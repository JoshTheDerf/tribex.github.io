module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ["."],
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
            new (require('less-plugin-clean-css'))()
          ],
        },
        files: {
          "dist/styles.css": "styles.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less:development']);

};
