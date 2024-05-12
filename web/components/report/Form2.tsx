import React, { useRef } from "react";
import {
  Button,
  Input,
  Image,
  VStack,
  Text,
  Center,
  Skeleton,
  ButtonGroup,
} from "@chakra-ui/react";

interface Form2Props {
  preview: string | ArrayBuffer | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form2 = ({ preview, handleImageUpload }: Form2Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack mt={12} mb={4} spacing={4} align="stretch">
      <VStack>
        {!preview && <Skeleton height="300px" width="300px" />}
        {preview && (
          <Image
            src={preview as string}
            alt="Preview Image"
            boxSize="sm"
            objectFit="contain"
            maxW="300px"
            maxH="300px"
          />
        )}
        <Text color="gray.500" fontSize="sm" textAlign="center">
          Upload or generate an image
        </Text>
      </VStack>
      <Center>
        <ButtonGroup>
          <Button onClick={triggerFileInputClick}>Upload Image</Button>
          {/* <Button
          // onClick={handleGenerateImage}
          // isDisabled={form2Data.imageGenerated}
          >
            Generate Image
          </Button> */}
        </ButtonGroup>
      </Center>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        hidden
      />
    </VStack>
  );
};

export default Form2;
