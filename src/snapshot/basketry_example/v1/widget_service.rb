# This code was generated by a tool.
# @basketry/sorbet@{{version}}
#
# Changes to this file may cause incorrect behavior and will be lost if
# the code is regenerated.

# typed: strict

module BasketryExample::V1
  module WidgetService
    extend T::Sig
    extend T::Helpers

    interface!

    sig do
      abstract.params(
        body: T.nilable(BasketryExample::V1::Types::CreateWidgetBody)
      ).void
    end
    def create_widget(body:)
    end

    sig do
      abstract.params(
        id: String
      ).void
    end
    def delete_widget_foo(id:)
    end

    sig do
      abstract.params(
        id: String
      ).returns(
        T.nilable(BasketryExample::V1::Types::Widget)
      )
    end
    def get_widget_foo(id:)
    end

    sig { abstract.returns(T.nilable(BasketryExample::V1::Types::Widget)) }
    def get_widgets
    end

    sig { abstract.void }
    def put_widget
    end
  end
end
