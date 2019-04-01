module Jekyll
  class AssetTag < Liquid::Tag
    attr_accessor :markup, :ext, :asset_path

    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
      @asset_path = Jekyll::AssetPathTag.send(:new, tag_name, markup, tokens)
      @ext = File.extname(markup)
    end

    def render(context)
      path = asset_path.render(context)
      tag(path)
    end

    def tag(path)
      path_ext = File.extname(path)
      if path_ext == '.js'
        %Q(<script src="#{path}"></script>)
      elsif path_ext == '.css'
        %Q(<link rel="stylesheet" href="#{path}">)
      else
        path
      end
    end
  end
end

Liquid::Template.register_tag('asset_tag', Jekyll::AssetTag)