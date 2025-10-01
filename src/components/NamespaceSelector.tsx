import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import api from "../services/axisoInstance";

interface NamespaceSelectorProps {
  selected: string | null;
  onSelect: (ns: string | null) => void;
}

const NamespaceSelector: React.FC<NamespaceSelectorProps> = ({ selected, onSelect }) => {
  const [namespaces, setNamespaces] = useState<string[]>([]);

  // Fetch namespaces from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/namespaces");
        setNamespaces(res.data.namespaces || []);
      } catch (err) {
        console.error("Failed to fetch namespaces", err);
      }
    })();
  }, []);

  const handleClear = async () => {
    if (!selected) return;
    try {
      await api.delete(`/namespaces/${encodeURIComponent(selected)}`);
      setNamespaces((prev) => prev.filter((ns) => ns !== selected));
      onSelect(null); // reset selection
    } catch (err) {
      console.error("Failed to clear namespace", err);
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center" mt={2}>
      <FormControl fullWidth>
        <InputLabel id="namespace-label">Namespace</InputLabel>
        <Select
          labelId="namespace-label"
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value || null)}
        >
          {namespaces.map((ns) => (
            <MenuItem key={ns} value={ns}>
              {ns}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        color="error"
        disabled={!selected}
        onClick={handleClear}
      >
        Clear Context
      </Button>
    </Box>
  );
};

export default NamespaceSelector;
