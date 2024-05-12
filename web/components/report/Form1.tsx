import React from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

interface Form1Props {
  title: string;
  description: string;
  price: number;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (description?: string) => void;
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form1 = ({
  title,
  description,
  price,
  handleTitleChange,
  handleDescriptionChange,
  handlePriceChange,
}: Form1Props) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter the cryptopasta title"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="content">Description</FormLabel>
        <MDEditor
          value={description}
          onChange={handleDescriptionChange}
          textareaProps={{
            placeholder: "Enter your markdown formatted description here...",
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="price" mt="1%">
          Price
        </FormLabel>

        <Input type="number" value={price} onChange={handlePriceChange} />
        <FormHelperText>Price in USD</FormHelperText>
      </FormControl>
    </VStack>
  );
};

export default Form1;
