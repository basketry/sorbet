# This code was generated by @basketry/sorbet@{{version}}
#
# Changes to this file may cause incorrect behavior and will be lost if
# the code is regenerated.
# 
# To make changes to the contents of this file:
# 1. Edit source/path.ext
# 2. Run the Basketry CLI
#
# About Basketry: https://github.com/basketry/basketry#readme
# About @basketry/sorbet: https://github.com/basketry/sorbet#readme

# typed: strict

module BasketryExample::V1::Enums
  class ExhaustiveParamsPathEnumArray < T::Enum
    enums do
      ONE = new('one')
      TWO = new('two')
      THREE = new('three')
    end
  end
end
