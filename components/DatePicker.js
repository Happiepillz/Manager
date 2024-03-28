import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';


// Set up of date selector 
const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date !== undefined) {
      setSelectedDate(date);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prevState) => !prevState);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDatePicker}>
         <Text style={styles.dateText}>{selectedDate.toDateString()}</Text> 
      </TouchableOpacity>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={selectedDate.toISOString().substr(0, 10)}
          onChange={(event) => setSelectedDate(new Date(event.target.value))}
          style={styles.webDatePicker}
        />
      ) : (
        showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
            minimumDate={new Date()}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  webDatePicker: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    padding: 5,
  },
});

export default DatePicker;
