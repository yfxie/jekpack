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
      find!(logical_path)
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
    def dist_path
      context.environments.first['site']['destination']
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