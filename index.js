import { useState } from 'react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Lunchsnoken() {
  const [ingredients, setIngredients] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateLunchIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lunch-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });
      const data = await response.json();
      setIdeas(data.ideas);
    } catch (error) {
      console.error("Fel vid hämtning av lunchidéer:", error);
      setIdeas(["Kunde inte hämta idéer. Prova igen."]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (idea) => {
    if (!favorites.includes(idea)) {
      setFavorites([...favorites, idea]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Lunchsnoken</h1>
      <p className="text-center text-gray-600 mb-6">Skriv in vad du har i kylen, så ger vi dig lunchidéer!</p>

      <Input
        placeholder="t.ex. ägg, ost, paprika"
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
      />
      <Button className="mt-4 w-full" onClick={generateLunchIdeas} disabled={loading}>
        {loading ? 'Snokar...' : 'Ge mig lunchförslag'}
      </Button>

      {ideas.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Förslag:</h2>
          {ideas.map((idea, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-gray-800 flex justify-between items-center">
                <span>{idea}</span>
                <Button size="sm" variant="outline" onClick={() => addToFavorites(idea)}>Spara</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Favoriter:</h2>
          {favorites.map((fav, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-gray-800">
                {fav}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
