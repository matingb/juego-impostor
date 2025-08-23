"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader } from "./components/AppHeader";
import { Card } from "./components/Card";
import { PrimaryButton } from "./components/PrimaryButton";
import { Icon } from "./components/Icon";
import { SetupCards } from "./components/SetupCards";
import { RoleCard } from "./components/RoleCard";
import { VoteScreen } from "./screens/VoteScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { WinScreen } from "./screens/WinScreen";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./theme";

function clampImpostors(totalPlayers: number, impostors: number): number {
  if (Number.isNaN(impostors) || impostors < 1) return 1;
  if (impostors >= totalPlayers) return Math.max(1, totalPlayers - 1);
  return impostors;
}

export default function App() {
  const [totalPlayers, setTotalPlayers] = useState<number>(3);
  const [totalPlayersText, setTotalPlayersText] = useState<string>("3");
  const [totalImpostors, setTotalImpostors] = useState<number>(1);
  const [totalImpostorsText, setTotalImpostorsText] = useState<string>("1");
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [wordListText, setWordListText] = useState<string>(
    "Playa\nMontaña\nBosque\nCiudad\nEscuela\nHospital\nBiblioteca\nRestaurante"
  );

  const [screen, setScreen] = useState<
    "setup" | "blank" | "role" | "vote" | "reveal" | "winImpostors" | "winCrew"
  >("setup");
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [impostorIndexes, setImpostorIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(
    null
  );
  const [lastEliminatedIndex, setLastEliminatedIndex] = useState<number | null>(
    null
  );
  const [alivePlayers, setAlivePlayers] = useState<boolean[]>([]);

  const screenContainerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: "#222",
    }),
    []
  );

  const words = useMemo(() => {
    return wordListText
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
  }, [wordListText]);

  function updateImpostorsSafe(nextImpostors: number) {
    const impostors = clampImpostors(
      totalPlayers,
      Math.floor(nextImpostors || 1)
    );
    setTotalImpostors(impostors);
    setTotalImpostorsText(String(impostors));
  }

  function updatePlayersSafe(nextPlayers: number) {
    const players = Math.max(3, Math.min(20, Math.floor(nextPlayers || 3)));
    setTotalPlayers(players);
    setTotalPlayersText(String(players));
    // Ajustar cantidad de impostores en base a la nueva cantidad de jugadores
    setTotalImpostors((prev) => clampImpostors(players, prev));
    // Redimensionar nombres manteniendo los existentes
    setPlayerNames((prev) => {
      if (prev.length === players) return prev;
      if (prev.length > players) return prev.slice(0, players);
      // si faltan, completar con strings vacíos
      const next = prev.slice();
      for (let i = prev.length; i < players; i += 1) {
        next.push("");
      }
      return next;
    });
  }

  function updatePlayersUiText(nextText: string) {
    setTotalPlayersText(nextText);
    const parsed = Number.parseInt(nextText, 10);
    const players = Number.isNaN(parsed)
      ? 0
      : Math.max(0, Math.min(20, Math.floor(parsed)));
    setPlayerNames((prev) => {
      if (prev.length === players) return prev;
      if (prev.length > players) return prev.slice(0, players);
      const next = prev.slice();
      for (let i = prev.length; i < players; i += 1) {
        next.push("");
      }
      return next;
    });
  }

  function handlePlayerNameChange(index: number, value: string) {
    setPlayerNames((prev) => {
      const copy = prev.slice();
      copy[index] = value;
      return copy;
    });
  }

  function startGame() {
    // Asegurar que usamos lo que está en los inputs, aunque no hayan hecho blur
    const parsedPlayers = Number.parseInt(totalPlayersText, 10);
    if (Number.isNaN(parsedPlayers)) {
      alert("Cantidad de jugadores inválida");
      return;
    }
    const players = Math.max(3, Math.min(20, Math.floor(parsedPlayers || 3)));
    if (players < 3) {
      alert("Debe haber al menos 3 jugadores");
      return;
    }
    // actualizar estado derivado
    updatePlayersSafe(players);

    const parsedImpostors = Number.parseInt(totalImpostorsText, 10);
    if (Number.isNaN(parsedImpostors)) {
      alert("Cantidad de impostores inválida");
      return;
    }
    const impostors = clampImpostors(players, Math.floor(parsedImpostors || 1));
    if (impostors < 1 || impostors >= players) {
      alert("Cantidad de impostores inválida");
      return;
    }
    updateImpostorsSafe(impostors);
    const pool = remainingWords.length > 0 ? remainingWords : words;
    if (pool.length === 0) {
      alert("Debes ingresar al menos una palabra");
      return;
    }

    const newImpostors: number[] = [];
    while (newImpostors.length < impostors) {
      const index = Math.floor(Math.random() * players);
      if (!newImpostors.includes(index)) {
        newImpostors.push(index);
      }
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedWord = pool[randomIndex];

    setImpostorIndexes(newImpostors);
    setKeyword(selectedWord);
    setRemainingWords(pool.filter((_, i) => i !== randomIndex));
    setCurrentPlayer(0);
    setSelectedPlayerIndex(null);
    setLastEliminatedIndex(null);
    setAlivePlayers(Array.from({ length: players }, () => true));
    setScreen("blank");
  }

  function showNextRole() {
    if (currentPlayer >= totalPlayers) {
      setScreen("vote");
      return;
    }
    setScreen("role");
  }

  function hideRole() {
    const next = currentPlayer + 1;
    setCurrentPlayer(next);
    setScreen("blank");
  }

  function resetGame() {
    setCurrentPlayer(0);
    setImpostorIndexes([]);
    setKeyword("");
    setScreen("setup");
    setSelectedPlayerIndex(null);
    setLastEliminatedIndex(null);
    setAlivePlayers([]);
  }

  function resetRemainingWords() {
    setRemainingWords([...words]);
  }

  function resetConfiguration() {
    const defaultPlayers = 5;
    const defaultImpostors = 1;
    const defaultNames = ["Ana", "Bruno", "Carla", "Diego", "Elena"];
    const defaultWordList =
      "Playa\nMontaña\nBosque\nCiudad\nEscuela\nHospital\nBiblioteca\nRestaurante";

    setTotalPlayers(defaultPlayers);
    setTotalPlayersText(String(defaultPlayers));
    setTotalImpostors(defaultImpostors);
    setTotalImpostorsText(String(defaultImpostors));
    setPlayerNames(defaultNames);
    setWordListText(defaultWordList);
    setRemainingWords([]);
    setSelectedPlayerIndex(null);
    setLastEliminatedIndex(null);
    setAlivePlayers([]);
    setScreen("setup");
  }

  const roleIsImpostor = impostorIndexes.includes(currentPlayer);

  const aliveCounts = useMemo(() => {
    const aliveTotal = alivePlayers.reduce((acc, v) => acc + (v ? 1 : 0), 0);
    const aliveImpostors = impostorIndexes.reduce(
      (acc, idx) => acc + (alivePlayers[idx] ? 1 : 0),
      0
    );
    const aliveNormals = aliveTotal - aliveImpostors;
    return { aliveTotal, aliveImpostors, aliveNormals } as const;
  }, [alivePlayers, impostorIndexes]);

  const handleSelectPlayer = useCallback((index: number) => {
    setSelectedPlayerIndex(index);
  }, []);

  const confirmElimination = useCallback(() => {
    if (selectedPlayerIndex === null) return;
    setAlivePlayers((prev) => {
      if (!prev[selectedPlayerIndex]) return prev;
      const next = prev.slice();
      next[selectedPlayerIndex] = false;
      return next;
    });
    setLastEliminatedIndex(selectedPlayerIndex);

    // Evaluate win conditions after state update; compute using next values synchronously
    const nextAliveImpostors = impostorIndexes.reduce(
      (acc, idx) =>
        acc +
        ((idx === selectedPlayerIndex ? false : alivePlayers[idx]) ? 1 : 0),
      0
    );
    const nextAliveTotal = alivePlayers.reduce(
      (acc, v, idx) =>
        acc + ((idx === selectedPlayerIndex ? false : v) ? 1 : 0),
      0
    );
    const nextAliveNormals = nextAliveTotal - nextAliveImpostors;

    if (nextAliveImpostors === 0) {
      setScreen("winCrew");
      return;
    }
    if (nextAliveImpostors === nextAliveNormals) {
      setScreen("winImpostors");
      return;
    }
    setScreen("reveal");
  }, [selectedPlayerIndex, impostorIndexes, alivePlayers]);

  const nextVotingRound = useCallback(() => {
    setSelectedPlayerIndex(null);
    setScreen("vote");
  }, []);

  const textColorSubtle = colors.textSubtle;

  const uiPlayersCount = (() => {
    const parsed = Number.parseInt(totalPlayersText, 10);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(20, Math.floor(parsed)));
  })();

  return (
    <SafeAreaView style={screenContainerStyle}>
      <ScrollView >
        <View style={{ width: "100%", alignSelf: "center", flex: 1, maxWidth: 720, padding: 16 }}>
          <AppHeader />

          {screen === "setup" && (
            <SetupCards
              totalPlayersText={totalPlayersText}
              onPlayersTextChange={updatePlayersUiText}
              onPlayersBlur={() => {
                const parsed = Number.parseInt(totalPlayersText, 10);
                if (!Number.isNaN(parsed)) {
                  updatePlayersSafe(parsed);
                } else {
                  setTotalPlayersText(String(totalPlayers));
                }
              }}
              totalImpostorsText={totalImpostorsText}
              onImpostorsTextChange={setTotalImpostorsText}
              onImpostorsBlur={() => {
                const parsed = Number.parseInt(totalImpostorsText, 10);
                if (!Number.isNaN(parsed)) {
                  updateImpostorsSafe(parsed);
                } else {
                  setTotalImpostorsText(String(totalImpostors));
                }
              }}
              uiPlayersCount={uiPlayersCount}
              playerNames={playerNames}
              onPlayerNameChange={handlePlayerNameChange}
              wordListText={wordListText}
              onWordListChange={setWordListText}
              availableWordsCount={remainingWords.length > 0 ? remainingWords.length : words.length}
              totalImpostors={totalImpostors}
              onResetConfiguration={resetConfiguration}
              onStartGame={startGame}
              labelStyle={labelStyle}
              playerNamesTitle={playerNamesTitle}
              listaTitleStyle={listaTitleStyle}
            />
          )}

          {null}

          {screen === "role" && (
            <RoleCard
              roleIsImpostor={roleIsImpostor}
              playerName={playerNames[currentPlayer] ? playerNames[currentPlayer] : `Jugador ${currentPlayer + 1}`}
              keyword={keyword}
              onNext={hideRole}
            />
          )}

          {screen === "blank" && (
            <Card style={{ flex: 1 }}>
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Icon name="phone" size={48} tintColor="#fff" />
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "white",
                    marginBottom: 8,
                  }}
                >
                  Pasa el dispositivo
                </Text>
                <Text style={{ color: textColorSubtle, marginBottom: 12 }}>
                  {currentPlayer < totalPlayers
                    ? `Entrega el dispositivo a ${
                        playerNames[currentPlayer] ||
                        `Jugador ${currentPlayer + 1}`
                      }`
                    : "Todos los jugadores han visto su rol"}
                </Text>
                <PrimaryButton
                  label="Ver mi rol"
                  onPress={showNextRole}
                  leftIcon="eye"
                />
              </View>
            </Card>
          )}

          {screen === "vote" && (
            <VoteScreen
              playerNames={playerNames}
              alivePlayers={alivePlayers}
              selectedIndex={selectedPlayerIndex}
              onSelect={handleSelectPlayer}
              onConfirm={confirmElimination}
            />
          )}

          {screen === "reveal" && lastEliminatedIndex !== null && (
            <RevealScreen
              playerName={
                playerNames[lastEliminatedIndex] ||
                `Jugador ${lastEliminatedIndex + 1}`
              }
              wasImpostor={impostorIndexes.includes(lastEliminatedIndex)}
              aliveImpostors={aliveCounts.aliveImpostors}
              aliveNormals={aliveCounts.aliveNormals}
              onNextRound={nextVotingRound}
              onNewGame={resetGame}
            />
          )}

          {screen === "winImpostors" && (
            <WinScreen
              title="¡Ganaron los impostores!"
              subtitle={`Impostores: ${aliveCounts.aliveImpostors} • Tripulantes: ${aliveCounts.aliveNormals}`}
              onNewGame={resetGame}
            />
          )}

          {screen === "winCrew" && (
            <WinScreen
              title="¡Ganan los jugadores normales!"
              subtitle={`Impostores: ${aliveCounts.aliveImpostors} • Tripulantes: ${aliveCounts.aliveNormals}`}
              onNewGame={resetGame}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardStyle = {
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    lineHeight: 36,
  } as const,
};

const playerNamesTitle = {
  fontSize: 18,
  fontWeight: "600",
  color: "white",
  marginBottom: 8,
} as const;

const labelStyle = {
  marginBottom: 8,
  fontWeight: "600",
  color: "white",
} as const;

const listaTitleStyle = {
  fontSize: 16,
  color: "white",
  fontWeight: "600",
} as const;

