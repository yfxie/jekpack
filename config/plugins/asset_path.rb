require 'open-uri'

module Jekyll
  class AssetPathTag < Liquid::Tag
    class MissingEntryError < StandardError; end
    class ManifestTimeout < StandardError; end

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
      path = find!(logical_path)
      "#{prefix}#{path}"
    rescue MissingEntryError => e
      if is_production?
        raise e
      else
        %Q(<script>alert('#{e.message}')</script>).gsub(/\n/, '')
      end
    end

    def find!(name)
      if ext == '.js'
        data["javascripts/#{name}"] || handle_missing_entry(name)
      else
        data["stylesheets/#{name}"] || data["stylesheets/#{name}".gsub('.css', '.js')] || handle_missing_entry(name)
      end
    end

    def data
      @data = load
    end

    def load
      JSON.parse(public_manifest_path.read)
    end

    private
    def source_path
      context.environments[0]['site']['source']
    end

    def app_root
      @app_root ||= begin
        path = source_path
        loop do
          file_path = File.join(path, 'package.json')
          if File.file?(file_path)
            if Pathname.new(path).root?
              raise "Cant find the app_root"
            end
            break
          end
          path = File.expand_path('..', path)
        end
        Pathname.new(path)
      end
    end

    def prefix
      is_production? ? '/assets/' : '/'
    end

    def is_production?
      ENV['JEKYLL_ENV'] == 'production'
    end

    def handle_missing_entry(name)
      raise MissingEntryError, missing_file_from_manifest_error(name)
    end

    def missing_file_from_manifest_error(name)
      <<-MSG
      #{name} not found. the manifest as following: 
      #{JSON.pretty_generate(data)}
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

    def public_output_path
      is_production? ? app_root.join('dist') : app_root.join('tmp/dist')
    end

    def public_manifest_path
      public_output_path.join('assets/manifest.json')
    end
  end
end

Liquid::Template.register_tag('asset_path', Jekyll::AssetPathTag)