module Jekyll
  module EvalFilter
    def eval(input)
      Liquid::Template.parse(input).render(@context)
    end
  end
end

Liquid::Template.register_filter(Jekyll::EvalFilter)