import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'

const mainColor = 'gray';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  smsIcon: {
    color: 'darkgray',
    fontSize: 30,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: mainColor,
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

const Tel = ({
  containerStyle,
  index,
  name,
  number,
  openWhatsApp,
  onPressTel,
}) => {

  return (
    <TouchableOpacity onPress={() => onPressTel(number)}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.iconRow}>
          {index === 0 && (
            <Icon
              name="call"
              underlayColor="transparent"
              iconStyle={styles.telIcon}
              onPress={() => onPressTel(number)}
            />
          )}
        </View>
        <View style={styles.telRow}>
          <View style={styles.telNumberColumn}>
            <Text style={styles.telNumberText}>{number}</Text>
          </View>
          <View style={styles.telNameColumn}>
            {name.length !== 0 && (
              <Text style={styles.telNameText}>{name}</Text>
            )}
          </View>
        </View>
        <View style={styles.smsRow}>
          <Icon
            name="textsms"
            underlayColor="transparent"
            iconStyle={styles.smsIcon}
            onPress={() => openWhatsApp(number)}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

Tel.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  number: PropTypes.string.isRequired,
  openWhatsApp: PropTypes.func.isRequired,
  onPressTel: PropTypes.func.isRequired,
}

Tel.defaultProps = {
  containerStyle: {},
  name: null,
}

export default Tel