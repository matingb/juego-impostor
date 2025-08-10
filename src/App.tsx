import React, { useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

function clampImpostors(totalPlayers: number, impostors: number): number {
  if (Number.isNaN(impostors) || impostors < 1) return 1;
  if (impostors >= totalPlayers) return Math.max(1, totalPlayers - 1);
  return impostors;
}

export default function App() {
  const [totalPlayers, setTotalPlayers] = useState<number>(5);
  const [totalImpostors, setTotalImpostors] = useState<number>(1);
  const [wordListText, setWordListText] = useState<string>(
    'Playa\nMontaña\nBosque\nCiudad\nEscuela\nHospital\nBiblioteca\nRestaurante'
  );

  const [screen, setScreen] = useState<'setup' | 'blank' | 'role' | 'end'>('setup');
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [impostorIndexes, setImpostorIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const screenContainerStyle = useMemo(() => ({
    flex: 1,
    backgroundColor: '#222',
  }), []);

  const words = useMemo(() => {
    return wordListText
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
  }, [wordListText]);

  function updateStatsSafe(nextPlayers: number, nextImpostors: number) {
    const players = Math.max(3, Math.min(20, Math.floor(nextPlayers || 3)));
    const impostors = clampImpostors(players, Math.floor(nextImpostors || 1));
    setTotalPlayers(players);
    setTotalImpostors(impostors);
  }

  function startGame() {
    if (Number.isNaN(totalPlayers) || totalPlayers < 3) {
      alert('Debe haber al menos 3 jugadores');
      return;
    }
    if (
      Number.isNaN(totalImpostors) ||
      totalImpostors < 1 ||
      totalImpostors >= totalPlayers
    ) {
      alert('Cantidad de impostores inválida');
      return;
    }
    if (words.length === 0) {
      alert('Debes ingresar al menos una palabra');
      return;
    }

    const newImpostors: number[] = [];
    while (newImpostors.length < totalImpostors) {
      const index = Math.floor(Math.random() * totalPlayers);
      if (!newImpostors.includes(index)) {
        newImpostors.push(index);
      }
    }

    setImpostorIndexes(newImpostors);
    setKeyword(words[Math.floor(Math.random() * words.length)]);
    setCurrentPlayer(0);
    setScreen('blank');
  }

  function showNextRole() {
    if (currentPlayer >= totalPlayers) {
      setScreen('end');
      return;
    }
    setScreen('role');
  }

  function hideRole() {
    const next = currentPlayer + 1;
    setCurrentPlayer(next);
    setScreen('blank');
  }

  function resetGame() {
    setCurrentPlayer(0);
    setImpostorIndexes([]);
    setKeyword('');
    setScreen('setup');
  }

  const roleIsImpostor = impostorIndexes.includes(currentPlayer);

  const textColorSubtle = 'rgba(255,255,255,0.85)';

  return (
    <SafeAreaView style={screenContainerStyle}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ minHeight: '100%', padding: 16 }}>
        <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: 'white', textAlign: 'center' }}>
              🕵️ Juego de Impostores
            </Text>
            <Text style={{ fontSize: 14, color: textColorSubtle }}>
              ¿Podrás descubrir quién es el impostor?
            </Text>
          </View>

          {screen === 'setup' && (
            <View style={cardStyle.card}>
              <Text style={cardStyle.cardTitle}>Configuración</Text>

              <View
                style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}
              >
                <View style={{ flex: 1, marginRight: 8, marginBottom: 16 }}>
                  <Text style={labelStyle}>Cantidad de jugadores</Text>
                  <TextInput
                    style={inputStyle}
                    keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })}
                    value={String(totalPlayers)}
                    onChangeText={(t) =>
                      updateStatsSafe(parseInt(t || '3', 10), totalImpostors)
                    }
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8, marginBottom: 16 }}>
                  <Text style={labelStyle}>Cantidad de impostores</Text>
                  <TextInput
                    style={inputStyle}
                    keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })}
                    value={String(totalImpostors)}
                    onChangeText={(t) =>
                      updateStatsSafe(totalPlayers, parseInt(t || '1', 10))
                    }
                  />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={labelStyle}>Lista de palabras clave (una por línea)</Text>
                <TextInput
                  style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
                  multiline
                  value={wordListText}
                  onChangeText={setWordListText}
                />
              </View>

              <View
                style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8, flexWrap: 'wrap' }}
              >
                <Text style={{ color: textColorSubtle }}>
                  👥 {totalPlayers} jugadores
                </Text>
                <Text style={{ color: textColorSubtle, marginLeft: 12 }}>
                  ⚠️ {totalImpostors} {totalImpostors === 1 ? 'impostor' : 'impostores'}
                </Text>
              </View>

              <PrimaryButton label="▶️ Comenzar Juego" onPress={startGame} />
            </View>
          )}

          {screen === 'role' && (
            <View style={cardStyle.card}>
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <Text style={{ color: 'white', marginBottom: 12 }}>Jugador {currentPlayer + 1}</Text>

                {roleIsImpostor ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 48, marginBottom: 12 }}>🎭</Text>
                    <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 8, color: '#ff4757' }}>IMPOSTOR</Text>
                    <Text style={{ color: textColorSubtle, fontSize: 14, textAlign: 'center' }}>
                      No conoces la palabra clave. ¡Trata de descubrirla!
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 48, marginBottom: 12 }}>🕵️</Text>
                    <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 8, color: '#2ed573' }}>JUGADOR</Text>
                    <Text style={{ color: textColorSubtle, marginBottom: 8 }}>Palabra clave:</Text>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#ffd700', textAlign: 'center', marginBottom: 8 }}>{keyword}</Text>
                    <Text style={{ color: textColorSubtle, fontSize: 14, textAlign: 'center' }}>
                      ¡Describe esta palabra sin mencionarla!
                    </Text>
                  </View>
                )}

                <PrimaryButton label="👁️ Siguiente" onPress={hideRole} />
              </View>
            </View>
          )}

          {screen === 'blank' && (
            <View style={cardStyle.card}>
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📱</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 8 }}>Pasa el dispositivo</Text>
                <Text style={{ color: textColorSubtle, marginBottom: 12 }}>
                  {currentPlayer < totalPlayers
                    ? `Entrega el dispositivo al Jugador ${currentPlayer + 1}`
                    : 'Todos los jugadores han visto su rol'}
                </Text>
                <PrimaryButton label="👁️ Ver mi rol" onPress={showNextRole} />
              </View>
            </View>
          )}

          {screen === 'end' && (
            <View style={cardStyle.card}>
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🎉</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 8 }}>
                  ¡Todos tienen su rol!
                </Text>
                <Text style={{ fontSize: 14, color: textColorSubtle, marginBottom: 12 }}>
                  ¡A jugar!
                </Text>

                <Text style={{ color: 'white', marginBottom: 8 }}>
                  {totalPlayers - totalImpostors} Jugadores • {totalImpostors} {totalImpostors === 1 ? 'Impostor' : 'Impostores'}
                </Text>

                <SecondaryButton label="🔄 Nuevo Juego" onPress={resetGame} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardStyle = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
  } as const,
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  } as const,
};

const labelStyle = {
  fontWeight: '600',
  marginBottom: 8,
  color: 'rgba(255,255,255,0.9)',
} as const;

const inputStyle = {
  width: '100%',
  padding: 12,
  fontSize: 16,
  borderWidth: 2,
  borderColor: 'rgba(255,255,255,0.2)',
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: 'white',
} as const;

// Removed extra decorative styles to keep the UI minimal across platforms

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: '#45a049',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        minWidth: 200,
        marginTop: 8,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        minWidth: 200,
        marginTop: 8,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>{label}</Text>
    </TouchableOpacity>
  );
}


