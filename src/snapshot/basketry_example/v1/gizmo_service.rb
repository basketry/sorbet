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

# frozen_string_literal: true

module BasketryExample::V1
  module GizmoService
    extend T::Sig
    extend T::Helpers

    interface!

    #
    #
    # Has a summary in addition to a description
    #
    # Has a description in addition to a summary
    #
    # @param [BasketryExample::V1::Enums::CreateGizmoSize, nil] size Anonymous enum
    #
    # @return [BasketryExample::V1::Types::Gizmo]
    #
    sig do
      abstract.params(
        size: T.nilable(BasketryExample::V1::Enums::CreateGizmoSize)
      ).returns(
        BasketryExample::V1::Types::Gizmo
      )
    end
    def create_gizmo(size: nil)
    end

    #
    # Only has a summary
    #
    # @param [String, nil] search
    #
    # @return [BasketryExample::V1::Types::GizmosResponse]
    #
    sig do
      abstract.params(
        search: T.nilable(String)
      ).returns(
        BasketryExample::V1::Types::GizmosResponse
      )
    end
    def get_gizmos(search: nil)
    end

    #
    # @param [Array<String>, nil] factors array of primitive
    #
    # @return [BasketryExample::V1::Types::Gizmo]
    #
    sig do
      abstract.params(
        factors: T.nilable(T::Array[String])
      ).returns(
        BasketryExample::V1::Types::Gizmo
      )
    end
    def update_gizmo(factors: nil)
    end
  end
end
