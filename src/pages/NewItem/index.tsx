import { View, Text } from "react-native";
import React, { useState } from "react";
import { generateUniqueId } from "../../helpers";
import { useData } from "../../hooks/data";
import { Button, Input } from "@rneui/base";
import { Container, FormContainer, ButtonContainer } from "./style";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const NewItem: React.FC = () => {
  const { addItem } = useData();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");

  const handleOnsave = () => {
    if (name && kcal) {
      addItem({
        id: generateUniqueId(),
        name,
        kcal: Number(kcal),
        date: moment(),
      });
      navigation.goBack();
    }
  };
  return (
    <Container>
      <FormContainer>
        <Input
          label="Nome"
          value={name}
          onChangeText={setName}
          placeholder="Descrição"
        />
        <Input
          label="kcal"
          value={kcal}
          onChangeText={setKcal}
          placeholder="Somente Números"
        />
      </FormContainer>
      <ButtonContainer>
        <Button title="Salvar" type="outline" onPress={handleOnsave} />
      </ButtonContainer>
    </Container>
  );
};

export default NewItem;
