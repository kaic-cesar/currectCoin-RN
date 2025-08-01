import {
    View,
    Text
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerItem(props) {

    let moedasItem = props.moedas.map((item, index) => {
        return <Picker.Item value={item.key} key={index} label={item.key}/>
    })

    return (
        <View>
            <Picker 
                selectedValue={props.moedaSelecionada}
                onValueChange={ (value) => props.onChange(value) }
            >
                {moedasItem}
            </Picker>
        </View>
    )
}