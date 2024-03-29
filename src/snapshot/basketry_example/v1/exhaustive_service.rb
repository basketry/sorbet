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
  module ExhaustiveService
    extend T::Sig
    extend T::Helpers

    interface!

    #
    # @param [String, nil] string_no_format
    # @param [Date, nil] string_date
    # @param [DateTime, nil] string_date_time
    # @param [Integer, nil] integer_no_format
    # @param [Integer, nil] integer_int32
    # @param [Integer, nil] integer_int64
    # @param [Numeric, nil] number_no_format
    # @param [Float, nil] number_float
    # @param [Float, nil] number_double
    #
    sig do
      abstract.params(
        string_no_format: T.nilable(String),
        string_date: T.nilable(Date),
        string_date_time: T.nilable(DateTime),
        integer_no_format: T.nilable(Integer),
        integer_int32: T.nilable(Integer),
        integer_int64: T.nilable(Integer),
        number_no_format: T.nilable(Numeric),
        number_float: T.nilable(Float),
        number_double: T.nilable(Float)
      ).void
    end
    def exhaustive_formats(string_no_format: nil, string_date: nil, string_date_time: nil, integer_no_format: nil, integer_int32: nil, integer_int64: nil, number_no_format: nil, number_float: nil, number_double: nil)
    end

    #
    # @param [String, nil] query_string
    # @param [BasketryExample::V1::Enums::ExhaustiveParamsQueryEnum, nil] query_enum
    # @param [Numeric, nil] query_number
    # @param [Integer, nil] query_integer
    # @param [T::Boolean, nil] query_boolean
    # @param [Array<String>, nil] query_string_array
    # @param [Array<BasketryExample::V1::Enums::ExhaustiveParamsQueryEnumArray>, nil] query_enum_array
    # @param [Array<Numeric>, nil] query_number_array
    # @param [Array<Integer>, nil] query_integer_array
    # @param [Array<T::Boolean>, nil] query_boolean_array
    # @param [String] path_string
    # @param [BasketryExample::V1::Enums::ExhaustiveParamsPathEnum] path_enum
    # @param [Numeric] path_number
    # @param [Integer] path_integer
    # @param [T::Boolean] path_boolean
    # @param [Array<String>] path_string_array
    # @param [Array<BasketryExample::V1::Enums::ExhaustiveParamsPathEnumArray>] path_enum_array
    # @param [Array<Numeric>] path_number_array
    # @param [Array<Integer>] path_integer_array
    # @param [Array<T::Boolean>] path_boolean_array
    # @param [String, nil] header_string
    # @param [BasketryExample::V1::Enums::ExhaustiveParamsHeaderEnum, nil] header_enum
    # @param [Numeric, nil] header_number
    # @param [Integer, nil] header_integer
    # @param [T::Boolean, nil] header_boolean
    # @param [Array<String>, nil] header_string_array
    # @param [Array<BasketryExample::V1::Enums::ExhaustiveParamsHeaderEnumArray>, nil] header_enum_array
    # @param [Array<Numeric>, nil] header_number_array
    # @param [Array<Integer>, nil] header_integer_array
    # @param [Array<T::Boolean>, nil] header_boolean_array
    # @param [BasketryExample::V1::Types::ExhaustiveParamsBody, nil] body
    #
    sig do
      abstract.params(
        path_string: String,
        path_enum: BasketryExample::V1::Enums::ExhaustiveParamsPathEnum,
        path_number: Numeric,
        path_integer: Integer,
        path_boolean: T::Boolean,
        path_string_array: T::Array[String],
        path_enum_array: T::Array[BasketryExample::V1::Enums::ExhaustiveParamsPathEnumArray],
        path_number_array: T::Array[Numeric],
        path_integer_array: T::Array[Integer],
        path_boolean_array: T::Array[T::Boolean],
        query_string: T.nilable(String),
        query_enum: T.nilable(BasketryExample::V1::Enums::ExhaustiveParamsQueryEnum),
        query_number: T.nilable(Numeric),
        query_integer: T.nilable(Integer),
        query_boolean: T.nilable(T::Boolean),
        query_string_array: T.nilable(T::Array[String]),
        query_enum_array: T.nilable(T::Array[BasketryExample::V1::Enums::ExhaustiveParamsQueryEnumArray]),
        query_number_array: T.nilable(T::Array[Numeric]),
        query_integer_array: T.nilable(T::Array[Integer]),
        query_boolean_array: T.nilable(T::Array[T::Boolean]),
        header_string: T.nilable(String),
        header_enum: T.nilable(BasketryExample::V1::Enums::ExhaustiveParamsHeaderEnum),
        header_number: T.nilable(Numeric),
        header_integer: T.nilable(Integer),
        header_boolean: T.nilable(T::Boolean),
        header_string_array: T.nilable(T::Array[String]),
        header_enum_array: T.nilable(T::Array[BasketryExample::V1::Enums::ExhaustiveParamsHeaderEnumArray]),
        header_number_array: T.nilable(T::Array[Numeric]),
        header_integer_array: T.nilable(T::Array[Integer]),
        header_boolean_array: T.nilable(T::Array[T::Boolean]),
        body: T.nilable(BasketryExample::V1::Types::ExhaustiveParamsBody)
      ).void
    end
    def exhaustive_params(path_string:, path_enum:, path_number:, path_integer:, path_boolean:, path_string_array:, path_enum_array:, path_number_array:, path_integer_array:, path_boolean_array:, query_string: nil, query_enum: nil, query_number: nil, query_integer: nil, query_boolean: nil, query_string_array: nil, query_enum_array: nil, query_number_array: nil, query_integer_array: nil, query_boolean_array: nil, header_string: nil, header_enum: nil, header_number: nil, header_integer: nil, header_boolean: nil, header_string_array: nil, header_enum_array: nil, header_number_array: nil, header_integer_array: nil, header_boolean_array: nil, body: nil)
    end
  end
end
