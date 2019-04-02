module Jekyll
  class PageAssetTag < Liquid::Tag
    PARAM_SYNTAX = %r!
        ([\w-]+)\s*=\s*
        (?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|([\w\.-]+))
    !x.freeze

    attr_reader :params

    def initialize(tag_name, markup, tokens)
      super
      @params = parse_params(markup.strip)
    end

    def tag(asset_path)
      path_ext = File.extname(asset_path)
      if path_ext == '.js'
        %Q(<script src="#{asset_path}"></script>)
      elsif path_ext == '.css'
        %Q(<link rel="stylesheet" href="#{asset_path}">)
      end
    end

    def ext
      raise NotImplementedError
    end

    def prefix
      @prefix ||= params['prefix'] || ''
    end

    def ignore_pattern
      pattern = params['ignore_pattern']
      %r[#{pattern}] if pattern
    end

    def lookup_paths(context)
      normalize_page_path = context.registers[:page]['path'].gsub(/\.\w+$/, '')
      if ignore_pattern
        normalize_page_path.gsub!(ignore_pattern, '')
      end
      [
        normalize_page_path,
        normalize_page_path.gsub('index', ''),
      ].map{ |page_path| File.join(prefix, page_path, "main#{ext}") }
    end

    def render(context)
      asset_paths = lookup_paths(context).map do |search_path|
        begin
          Liquid::Template.parse(%Q({% asset_path #{search_path} %})).render(context)
        rescue
          next
        end
      end
      asset_path = asset_paths.compact.first
      tag(asset_path) if asset_path
    end

    private
    def parse_params(markup)
      params = {}

      while (match = PARAM_SYNTAX.match(markup))
        markup = markup[match.end(0)..-1]

        value = if match[2]
                  match[2].gsub('\\"', '"')
                elsif match[3]
                  match[3].gsub("\\'", "'")
                end

        params[match[1]] = value
      end
      params
    end
  end

  class PageStylesheetTag < PageAssetTag
    def ext
      '.css'
    end
  end

  class PageJavascriptTag < PageAssetTag
    def ext
      '.js'
    end
  end
end

Liquid::Template.register_tag("page_stylesheet_tag", Jekyll::PageStylesheetTag)
Liquid::Template.register_tag("page_javascript_tag", Jekyll::PageJavascriptTag)