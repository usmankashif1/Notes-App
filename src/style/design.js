// import { StyleSheet} from 'react-native'
// import theme from './Constants';
// import { RF } from '../utlis/responsive';



// const design = StyleSheet.create({
//     heading:{
//         fontSize:RF(35),
//         fontFamily:theme.Fonts.Semi_Bold,
//         color:theme.color.textColor
//     },
//     subHeading:{
//         fontSize:RF(15),
//         fontFamily:theme.Fonts.regular,
//         color:theme.color.textColor
//     },
// })

// export default design;




import { StyleSheet } from 'react-native';
import theme from './Constants';
import { RF } from '../utlis/responsive';

const design = StyleSheet.create({
    heading: {
        fontSize: RF(34),
        fontFamily: theme.Fonts.Extra_Bold,
        color: theme.color.textColor,
        letterSpacing: -0.5,
    },
    subHeading: {
        fontSize: RF(15),
        fontFamily: theme.Fonts.regular,
        color: theme.color.mutedText,
        lineHeight: RF(22),
    },
});

export default design;