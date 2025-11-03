import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { IconButton } from "react-native-paper";
import { styles } from "./_styles";
import { useClients } from "./_hooks";

export default function ClientsScreen() {
  const { user } = useAuth();
  const { clients, loading, accessCode, isAdmin, copyAccessCode } =
    useClients(user);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#6200ff"
          style={{ marginTop: 50 }}
        />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Ta strona jest dostępna tylko dla administratorów
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.accessCodeContainer}>
          <Text style={styles.accessCodeLabel}>Kod zaproszeniowy</Text>
          <TouchableOpacity
            testID="copy-access-code-button"
            style={styles.accessCodeButton}
            onPress={copyAccessCode}
          >
            <Text style={styles.accessCodeText}>{accessCode}</Text>
            <IconButton
              icon="content-copy"
              iconColor="#6200ff"
              size={24}
              style={{ margin: 0, padding: 0 }}
            />
          </TouchableOpacity>
          <Text style={styles.accessCodeHint}>
            Udostępnij ten kod użytkownikom, aby mogli zarejestrować się w Twoim
            parkingu
          </Text>
        </View>

        <View style={styles.clientsSection}>
          <Text style={styles.sectionTitle}>
            Lista klientów ({clients.length})
          </Text>

          {clients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconButton
                icon="account-multiple-outline"
                iconColor="#ccc"
                size={64}
              />
              <Text style={styles.emptyText}>Brak klientów</Text>
              <Text style={styles.emptyHint}>
                Udostępnij kod zaproszeniowy, aby użytkownicy mogli się
                zarejestrować
              </Text>
            </View>
          ) : (
            clients.map((client) => (
              <View key={client.id} style={styles.clientCard}>
                <View style={styles.clientIcon}>
                  <IconButton
                    icon="account"
                    iconColor="#6200ff"
                    size={32}
                    style={{ margin: 0 }}
                  />
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.displayName}</Text>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                  <Text style={styles.clientDate}>
                    Dołączył:{" "}
                    {new Date(client.createdAt).toLocaleDateString("pl-PL")}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
