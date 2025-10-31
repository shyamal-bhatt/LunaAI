// Chat screen component
// - Displays the chatbot interface for menstrual cycle questions
// - Provides text input for user messages
// - Placeholder for future LLM integration
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { chatStyles as styles } from '../../styles/chatStyles';

export default function Chat() {
  // Track the message text entered by the user
  const [message, setMessage] = useState('');

  // Handler called when user presses send button
  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message.trim());
      // TODO: Send message to LLM/backend
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Main chat area - placeholder for messages */}
        <View style={styles.chatArea}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>Chat with LunaAI</Text>
            <Text style={styles.placeholderText}>
              Ask questions about your menstrual cycle
            </Text>
          </View>
        </View>

        {/* Input area with text field and send button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <MaterialCommunityIcons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

