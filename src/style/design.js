import { StyleSheet} from 'react-native'
import { scale } from 'react-native-size-matters';
import theme from './Constants';



const design = StyleSheet.create({
    heading:{
        fontSize:scale(35),
        fontFamily:theme.Fonts.Semi_Bold,
        color:theme.color.textColor
    },
    subHeading:{
        fontSize:scale(15),
        fontFamily:theme.Fonts.light,
        color:theme.color.textColor
    },
})

export default design;
