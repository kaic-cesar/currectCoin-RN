import { useState, useEffect, use } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import PickerItem from './src/Picker'
import { api } from './src/Services/api';

export default function App() {

  const [loading, setLoading] = useState(true);
  const [moedas, setMoedas] = useState([]);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0)

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    async function loadMoedas(){
      const response = await api.get('all')

      let arrayMoedas = [];
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })

      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false);


    }

    loadMoedas();

  },[] )

  async function converter(){
    if(moedaBValor === 0 || moedaBValor === "" || moedaBValor === null) {
      return;
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`)
    console.log(response.data[moedaSelecionada].ask)

    let resultado = response.data[moedaSelecionada].ask * parseFloat(moedaBValor);
    console.log(resultado.toFixed(2))

    setValorConvertido(`${resultado.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}`);
    setValorMoeda(moedaBValor)

    Keyboard.dismiss();
  }

  if(loading){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215'}}>
        <ActivityIndicator color='#fff'size='large'/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
       <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda:</Text>

        <PickerItem
          moedas={moedas}
          moedaSelecionada={moedaSelecionada}
          onChange={(moeda) => setMoedaSelecionada(moeda)}
        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}>Digite um valor para converter em R$</Text>
        <TextInput 
          placeholder='Ex. 1.50'
          style={styles.input}
          keyboardType='numeric'
          value={moedaBValor}
          onChangeText={(valor) => setMoedaBValor(valor)}
        />
      </View>

      <TouchableOpacity style={styles.botaoArea} onPress={converter}>
        <Text style={styles.botaoText}>Converter</Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
          <Text style={styles.valoConvertido}>
            {valorMoeda} {moedaSelecionada}
          </Text>

          <Text style={{fontSize: 18, margin: 8, fontWeight: 300, color: '#222'}}>
            corresponde a
          </Text>

          <Text style={styles.valoConvertido}>
            {`${valorConvertido}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 70,
    alignItems: 'center'
  },  
  areaMoeda:{
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 2
  },
  titulo:{
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingLeft: 5,
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop: 8,
    paddingBottom: 8,
  },
  input:{
    width: '100%',
    padding: 8,
    fontSize: 17,
    color: '#000'
  },
  botaoArea:{
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  botaoText:{
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18
  },
  areaResultado:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  valoConvertido:{
    fontSize: 25,
    color: '#000',
    fontWeight: '700'
  }
});
