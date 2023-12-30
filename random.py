import pytest
import random


# Mock implementation of the text style converter
def convert_text_style(text, author, section):
    if not text or not author:
        raise ValueError("Invalid input: text or author is empty")

    if section[1] <= section[0] or section[0] >= len(text) or section[1] > len(text):
        raise ValueError("Invalid input: invalid section indices")

    # Mock behavior: Just return a string indicating conversion done
    return f"Text converted to style of {author}"


# Test case for the mock text style converter
def test_convert_text_style_with_random_invalid_input():
    # Generate a random text string
    input_text = "".join(random.choices("abcdefghijklmnopqrstuvwxyz ", k=100))

    # Use an invalid author name
    author = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=10))

    # Define an invalid section (e.g., end index is before the start index)
    section = (50, 10)  # Invalid as the end index is less than the start index

    # Expecting a ValueError due to invalid input
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)


def test_convert_text_style_with_empty_text():
    # Empty text string
    input_text = ""

    # Valid author name and section
    author = "Jane Austen"
    section = (0, 10)

    # Expecting a ValueError due to empty text
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)


def test_convert_text_style_with_valid_input():
    # Sample text
    input_text = "To be or not to be, that is the question."

    # Valid author name and section
    author = "William Shakespeare"
    section = (0, 10)  # Convert the first 10 characters

    # Expected output format
    expected_output = f"Text converted to style of {author}"

    # Call the function
    result = convert_text_style(input_text, author, section)

    # Check if the result matches the expected output format
    assert result == expected_output


def test_convert_text_style_with_invalid_section_indices():
    # Sample text
    input_text = "The quick brown fox jumps over the lazy dog."

    # Valid author name
    author = "Mark Twain"

    # Invalid section (start index is greater than text length)
    section = (100, 110)

    # Expecting a ValueError due to invalid section indices
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)

import pytest
import random


# Mock implementation of the text style converter
def convert_text_style(text, author, section):
    if not text or not author:
        raise ValueError("Invalid input: text or author is empty")

    if section[1] <= section[0] or section[0] >= len(text) or section[1] > len(text):
        raise ValueError("Invalid input: invalid section indices")

    # Mock behavior: Just return a string indicating conversion done
    return f"Text converted to style of {author}"


# Test case for the mock text style converter
def test_convert_text_style_with_random_invalid_input():
    # Generate a random text string
    input_text = "".join(random.choices("abcdefghijklmnopqrstuvwxyz ", k=100))

    # Use an invalid author name
    author = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=10))

    # Define an invalid section (e.g., end index is before the start index)
    section = (50, 10)  # Invalid as the end index is less than the start index

    # Expecting a ValueError due to invalid input
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)


def test_convert_text_style_with_empty_text():
    # Empty text string
    input_text = ""

    # Valid author name and section
    author = "Jane Austen"
    section = (0, 10)

    # Expecting a ValueError due to empty text
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)


def test_convert_text_style_with_valid_input():
    # Sample text
    input_text = "To be or not to be, that is the question."

    # Valid author name and section
    author = "William Shakespeare"
    section = (0, 10)  # Convert the first 10 characters

    # Expected output format
    expected_output = f"Text converted to style of {author}"

    # Call the function
    result = convert_text_style(input_text, author, section)

    # Check if the result matches the expected output format
    assert result == expected_output


def test_convert_text_style_with_invalid_section_indices():
    # Sample text
    input_text = "The quick brown fox jumps over the lazy dog."

    # Valid author name
    author = "Mark Twain"

    # Invalid section (start index is greater than text length)
    section = (100, 110)

    # Expecting a ValueError due to invalid section indices
    with pytest.raises(ValueError):
        convert_text_style(input_text, author, section)


