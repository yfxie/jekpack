require 'open-uri'

module Jekyll
  class AssetPathTag < Liquid::Tag
    class ManifestTimeout < StandardError; end

    JAVASCRIPT_EXTENSIONS = ['.js']
    STYLESHEET_EXTENSIONS = ['.css']

    attr_accessor :markup, :ext, :context

    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render(context)
      logical_path = context[markup] || markup
      @ext = File.extname(logical_path)
      @context = context
      wait_manifest
      find!(logical_path)
    end

    def find!(name)
      keys = determine_keys(name)
      data.values_at(*keys).find(&:itself) || handle_missing_entry(name)
    end

    def determine_keys(name)
      keys = []
      if JAVASCRIPT_EXTENSIONS.include?(ext)
        keys << "javascripts/#{name}"
      elsif STYLESHEET_EXTENSIONS.include?(ext)
        keys << "stylesheets/#{name}"
        keys << "stylesheets/#{name}".gsub('.css', '.js')
      else
        keys << "media/#{name}"
      end
      keys.map{ |key| key.gsub(/\/+/, '/') }
    end

    def data
      @data = load
    end

    def load
      JSON.parse(public_manifest_path.read)
    end

    private
    def is_production?
      ENV['NODE_ENV'] == 'production'
    end

    def config
      @config ||= context.registers[:site].config
    end

    def source_path
      config['source']
    end

    def dist_path
      config['destination']
    end

    def handle_missing_entry(name)
      raise IOError, missing_file_message(name)
    end

    def missing_file_message(name)
      sources = %w(assets/stylesheets assets/javascripts assets/media)
                  .map{ |folder| Pathname.new(source_path).join(folder).to_s }

      <<-MSG
        Count not locate the assets file '#{name}' in #{sources}. For JS and CSS files must be named main.{js,scss}.
      MSG
    end

    def wait_manifest
      tried = 0
      until public_manifest_path.exist?
        sleep 0.5
        tried += 1
        Jekyll.logger.info('wait manifest...') if tried % 10 == 0
        if tried == 100
          raise ManifestTimeout
        end
      end
    end

    def public_manifest_path
      if ENV['JEKPACK_MANIFEST_PATH']
        Pathname.new(ENV['JEKPACK_MANIFEST_PATH'])
      else
        Pathname.new(dist_path).join('assets/manifest.json')
      end
    end
  end
end

Liquid::Template.register_tag('asset_path', Jekyll::AssetPathTag)