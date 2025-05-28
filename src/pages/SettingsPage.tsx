import { useEffect, useState } from "react";
import Checkbox from "../components/generic/Checkbox";
import { clangenRunner } from "../python/clangenRunner";
import BasePage from "../layout/BasePage";
import { useNavigate } from "react-router";

const settingLabels: Record<string, Record<string, string>> = {
  disasters: {
    label: "Allow mass extinction events",
  },
  deputy: {
    label:
      "Allow leaders to automatically choose a new deputy. The Warrior Code rules will be taken into account when choosing a deputy.",
  },
  "12_moon_graduation": {
    label: "Disable experience-based apprentice graduation.",
  },
  retirement: {
    label: "Cats will never retire due to a permanent condition",
  },
  become_mediator: {
    label: "Allow warriors and elders to choose to become mediators",
  },
  affair: {
    label: "Allow cats to breed with cats that aren't their mates",
  },
  "same sex birth": {
    label: "Pregnancy ignores biology",
  },
  "same sex adoption": {
    label: "Increase same-sex adoption",
  },
  "single parentage": {
    label: "Allow cats to have kittens with an unknown second parent",
  },
  "romantic with former mentor": {
    label: "Allow romantic interactions with former mentors",
  },
  "first cousin mates": {
    label: "Allow first cousins to be mates and have romantic interactions",
  },
};

function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [customCss, setCustomCss] = useState("");
  const navigator = useNavigate();

  useEffect(() => {
    document.title = "Settings | ClanGen Simulator";
  }, []);

  useEffect(() => {
    // disable on this page so users don't softlock themselves
    const customCssElement = document.getElementById("custom-css");
    if (customCssElement) {
      customCssElement.textContent = "";
    }

    const storedCss = localStorage.getItem("custom-css");
    if (storedCss) {
      setCustomCss(storedCss);
    }

    clangenRunner.getSettings().then((s) => {
      const temp: Record<string, boolean> = {};

      // only add settings with corresponding labels
      for (const [key, value] of Object.entries(s)) {
        if (settingLabels[key] !== undefined) {
          temp[key] = value;
        }
      }
      setSettings(temp);
    });
  }, []);

  function handleSave() {
    clangenRunner.setSettings(settings).then(() => {
      const customCssElement = document.getElementById("custom-css");
      if (customCssElement) {
        customCssElement.textContent = customCss;
      }
      localStorage.setItem("custom-css", customCss);
      navigator("/");
    });
  }

  return (
    <BasePage>
      <h2>Game Settings</h2>
      {Object.entries(settings).map(([settingName, value]) => (
        <Checkbox
          key={settingName}
          label={settingLabels[settingName]?.label}
          checked={value}
          onChange={() => setSettings({ ...settings, [settingName]: !value })}
        />
      ))}

      <h2>Site Settings</h2>
      <div>
        <fieldset>
          <legend>Custom CSS</legend>
          <textarea rows={10} cols={50} value={customCss} onChange={e => setCustomCss(e.target.value)} style={{resize: "none", width: "98%"}}></textarea>
          
          <p>Your custom CSS will be injected onto every page except for this one. For your safety, please only input CSS that you 100% trust.</p>
        </fieldset>
      </div>
      <button onClick={handleSave}>Save</button>
    </BasePage>
  );
}

export default SettingsPage;
