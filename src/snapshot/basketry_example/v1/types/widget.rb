# This code was generated by @basketry/sorbet@{{version}}
#
# Changes to this file may cause incorrect behavior and will be lost if
# the code is regenerated.
#
# To make changes to the contents of this file:
# 1. Edit source/path.ext
# 2. Run the Basketry CLI
#
# About Basketry: https://github.com/basketry/basketry/wiki
# About @basketry/sorbet: https://github.com/basketry/sorbet#readme

# frozen_string_literal: true

# typed: strict

module BasketryExample::V1::Types
  class Widget < T::Struct
    const :id, String
    const :name, T.nilable(String)
    const :fiz, Numeric
    const :buzz, T.nilable(Numeric)
    const :fizbuzz, T.nilable(Numeric)
    const :foo, T.nilable(BasketryExample::V1::Types::WidgetFoo)
    const :size, T.nilable(BasketryExample::V1::Enums::ProductSize)
  end
end
