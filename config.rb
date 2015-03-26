# Change this to :production when ready to deploy the CSS to the live server.
environment = :development

# Require any additional compass plugins here.
require 'compass'
require 'compass/import-once/activate'
require 'font-awesome-sass'
require 'bootstrap-sass'

# Location of the theme's resources.
http_path = "/"
css_dir = "css"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "js"
fonts_dir = "fonts"
output_style = :nested

output_style = (environment == :development) ? :expanded : :compressed

relative_assets = true

line_comments = (environment == :development) ? true : false

Sass::Script::Number.precision = 5
