import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Modal, TextField } from "@renderer/components";
import type { Game } from "@types";

import * as styles from "./game-options-modal.css";

import { SPACING_UNIT } from "../../../theme.css";
import { gameDetailsContext } from "../game-details.context";
import { FileSymlinkFileIcon } from "@primer/octicons-react";

export interface GameOptionsModalProps {
  visible: boolean;
  game: Game;
  onClose: () => void;
  selectGameExecutable: () => Promise<string | null>;
}

export function GameOptionsModal({
  visible,
  game,
  onClose,
  selectGameExecutable,
}: GameOptionsModalProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const { updateGame } = useContext(gameDetailsContext);

  const { t } = useTranslation("game_details");

  const handleChangeExecutableLocation = async () => {
    const location = await selectGameExecutable();

    if (location) {
      await window.electron.updateExecutablePath(game.id, location);
      updateGame();
    }
  };

  return (
    <>
      <Modal visible={visible} title={game.title} onClose={onClose}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${SPACING_UNIT}px`,
            minWidth: "500px",
          }}
        >
          <div style={{ marginBottom: `${SPACING_UNIT * 2}px` }}>
            <Button
              key={"general"}
              theme={currentCategoryIndex === 0 ? "primary" : "outline"}
              onClick={() => setCurrentCategoryIndex(0)}
            >
              General
            </Button>
          </div>

          <div className={styles.downloadSourceField}>
            <TextField
              label="Caminho do executável"
              value={game.executablePath || ""}
              readOnly
              theme="dark"
              disabled
            />

            <Button
              type="button"
              theme="outline"
              style={{ alignSelf: "flex-end" }}
              onClick={handleChangeExecutableLocation}
            >
              <FileSymlinkFileIcon />
              {"Alterar"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
