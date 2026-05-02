import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `Tu es PALM'AI, l'assistant phytosanitaire expert de PALMCI (Groupe SIFCA), spécialisé dans les plantations de palmiers à huile en Côte d'Ivoire.

Tu possèdes une expertise complète sur :
- Les maladies des palmiers à huile : Ganoderma boninense, Phytophthora palmivora, Fusarium oxysporum, Oryctes rhinoceros, Coelaenomenodera lameensis, Rhynchophorus ferrugineus, jaunissement mortel (MLO), carence nutritives (Mg, B, N)
- Les traitements biologiques et chimiques homologués en Côte d'Ivoire, conformes RSPO
- Les méthodes de surveillance PhytoBox (capteurs SHT31, MQ135, piezo, sol)
- L'interprétation des données capteurs : température, humidité sol/air, COV, vibration, pH
- Les pratiques agronomiques PALMCI sur 8 sites : Aboisso, Akoupé, Bangolo, Dabou, Divo, Gagnoa, Soubré, Tiassalé, et le site Ehania-Toumaguié
- Les protocoles Bonnes Pratiques Agricoles (BPA) RSPO
- Les seuils d'intervention phytosanitaire

Réponds toujours en français. Sois précis, actionnable et pratique. Utilise **gras** pour les termes importants. Pour les urgences critiques, commence par "⚠️ URGENT:" et indique le niveau de priorité (CRITIQUE / ÉLEVÉ / MODÉRÉ).

Format privilégié pour les recommandations : liste numérotée d'actions concrètes avec produits et doses.`;

const OFFLINE_RULES = [
  {
    keywords: ['ganoderma', 'pourriture basale', 'carpophore', 'polypore', 'stipe noir'],
    response: `🍄 **Ganoderma boninense — Protocole d'intervention**

**Niveau: CRITIQUE** — Maladie incurable, très contagieuse

**Symptômes confirmateurs** : carpophores (polypores) à la base, frondes en jupe, pourriture du stipe.

**Actions immédiates** :
1. Isoler le palmier avec ruban de signalisation jaune
2. Prélever un échantillon du carpophore pour confirmation labo (CNRA)
3. NE PAS arracher sans confirmation laboratoire
4. Photographier et géolocaliser

**Traitement biologique** :
- **Trichoderma harzianum** : 2 kg/pied en sol, rayon 1m du stipe
- **Compost organique** : 20 kg/pied pour améliorer la vie microbienne
- Améliorer le **drainage** du bloc (fossés, canaux)

**Surveillance** : Inspecter tous les palmiers dans un rayon de **50 mètres**. Réévaluation à 21 jours.`,
  },
  {
    keywords: ['phytophthora', 'pourriture cœur', 'spear leaf', 'odeur', 'couronne'],
    response: `🦠 **Phytophthora palmivora — Pourriture du cœur**

**Niveau: CRITIQUE**

**Actions immédiates** :
1. Retirer les feuilles centrales infectées (spear leaves)
2. Désinfecter les outils (hypochlorite 10%)

**Traitement curatif** :
- **Bouillie bordelaise (Cuivre)** : 4 L/ha sur la couronne foliaire
- Répéter tous les **14 jours** pendant 6 semaines
- **Métalaxyl** (si disponible) : en drench racinaire

**Mesures agronomiques** :
- Drainage urgent de la parcelle
- Éviter les blessures lors des travaux d'entretien
- Traitement préventif des palmiers adjacents`,
  },
  {
    keywords: ['fusarium', 'flétrissement', 'wilt', 'jaunissement unilatéral', 'vasculaire'],
    response: `🌿 **Fusarium oxysporum — Flétrissement vasculaire**

**Niveau: ÉLEVÉ**

**Diagnostic** : Couper une fronde à la base — présence d'un anneau brun vasculaire = Fusarium confirmé.

**Actions** :
1. Diagnostic PCR recommandé (CNRA Abidjan)
2. Éviter absolument toute blessure racinaire
3. Renforcer la nutrition **potassique** (K)

**Traitement préventif** :
- **Propiconazole** 0.5 L/100 L eau (triazole) — application sol
- **Mycorrhizes VAM** : inoculation des jeunes plants
- **Trichoderma asperellum** : 2 kg/ha en préventif`,
  },
  {
    keywords: ['oryctes', 'rhinoceros', 'galerie', 'flèche', 'coléoptère', 'stipe troué'],
    response: `🪲 **Oryctes rhinoceros — Charançon du palmier**

**Niveau: ÉLEVÉ**

**Actions immédiates** :
1. Installer **pièges à phéromones** : 1 piège/ha
2. Détruire les matières organiques en décomposition (gîtes larvaires)
3. Inspecter toutes les flèches du bloc

**Traitement biologique** (RSPO-conforme) :
- **Metarhizium anisopliae** : 10 g/piège + phéromone d'agrégation
- **Beauveria bassiana** : sur matières organiques en décomposition
- Délai d'action : **2–3 semaines**

**Interdit RSPO** : Éviter tous insecticides de synthèse.`,
  },
  {
    keywords: ['coelaenomenodera', 'défoliation', 'chenille', 'larve', 'feuille grignotée'],
    response: `🐛 **Coelaenomenodera lameensis — Défoliatrice**

**Seuil d'intervention : >30% défoliation**

**Traitement biologique** (RSPO-conforme) :
- **Pediobius elasmi** : lâcher 500 individus/ha (parasitoïde)
- **Bacillus thuringiensis kurstaki** : 0.75–1.5 kg/ha en ULV
- Application **le soir ou tôt le matin** (meilleure efficacité)

**Si >60% défoliation** :
- Urgence : traitement Bt en priorité
- Signaler à la direction phytosanitaire PALMCI

**Interdit RSPO** : Pyréthrinoïdes de synthèse interdits.`,
  },
  {
    keywords: ['carence', 'magnésium', 'jaunissement', 'ph bas', 'lessivage', 'mgso4'],
    response: `🌱 **Carence en Magnésium**

**Symptômes** : Jaunissement des palmes médianes/inférieures, nervures restant vertes (chlorose internervaire).

**Correction** :
- **MgSO₄** (sulfate de magnésium) : **3 kg/palmier** en épandage sol, rayon 1m du stipe
- **Kiesérite** : alternative plus lente mais durable
- Irriguer après application si possible

**Résultats visibles** : 6–8 semaines

**Prévention** : Amendement chaux si pH < 5.5 pour réduire le lessivage.`,
  },
  {
    keywords: ['jaunissement mortel', 'mlo', 'toutes palmes jaunes', 'mycoplasme'],
    response: `💀 **Jaunissement Mortel (MLO/Phytoplasme)**

⚠️ **URGENCE CRITIQUE — Maladie INCURABLE et HAUTEMENT CONTAGIEUSE**

**Actions IMMÉDIATES** :
1. ⛔ **Abattage et incinération immédiate** du palmier
2. Signaler IMMÉDIATEMENT à la direction phytosanitaire PALMCI
3. Inspecter tous les palmiers dans un rayon de **100 mètres**
4. Désinfection du sol à la **chaux vive** (500 g/m²)
5. Zone de quarantaine : ne pas transporter de résidus hors du bloc

**Vecteur** : Cicadelle *Myndus crudus* — traiter les palmiers adjacents avec insecticide systémique`,
  },
];

function findOfflineResponse(query: string): string {
  const q = query.toLowerCase();
  for (const rule of OFFLINE_RULES) {
    if (rule.keywords.some((k) => q.includes(k))) {
      return rule.response;
    }
  }
  return `🌴 **PALM'AI — Mode hors ligne**

Je n'ai pas de règle spécifique pour cette question dans ma base de données locale.

**Contacts d'urgence PALMCI** :
- Service phytosanitaire : contacter votre chef de bloc
- CNRA (diagnostic) : +225 27 22 XX XX XX
- Direction SIFCA Abidjan : selon hiérarchie

Pour les urgences critiques, **ne pas attendre** — signaler immédiatement à votre supérieur.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Try DeepSeek first
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const deepseekUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

    if (deepseekKey && !deepseekKey.includes('your-')) {
      try {
        const response = await fetch(`${deepseekUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            stream: true,
            max_tokens: 1024,
            temperature: 0.7,
          }),
        });

        if (response.ok && response.body) {
          return new Response(response.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-AI-Provider': 'deepseek',
            },
          });
        }
      } catch (e) {
        console.warn('DeepSeek failed, trying Anthropic:', e);
      }
    }

    // Try Anthropic Claude
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey && !anthropicKey.includes('your-')) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages,
            stream: true,
          }),
        });

        if (response.ok && response.body) {
          // Transform Anthropic SSE to DeepSeek-compatible format
          const encoder = new TextEncoder();
          const transformedStream = new ReadableStream({
            async start(controller) {
              const reader = response.body!.getReader();
              const decoder = new TextDecoder();
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const text = decoder.decode(value);
                  const lines = text.split('\n');
                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      try {
                        const data = JSON.parse(line.slice(6));
                        if (data.type === 'content_block_delta' && data.delta?.text) {
                          const chunk = `data: ${JSON.stringify({
                            choices: [{ delta: { content: data.delta.text } }],
                          })}\n\n`;
                          controller.enqueue(encoder.encode(chunk));
                        }
                      } catch {
                        /* skip */
                      }
                    }
                  }
                }
              } finally {
                controller.close();
              }
            },
          });

          return new Response(transformedStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-AI-Provider': 'anthropic',
            },
          });
        }
      } catch (e) {
        console.warn('Anthropic failed, using offline rules:', e);
      }
    }

    // Offline fallback — stream from rules
    const lastMsg = messages[messages.length - 1]?.content || '';
    const offlineText = findOfflineResponse(lastMsg);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = offlineText.split('');
        for (const char of words) {
          const chunk = `data: ${JSON.stringify({
            choices: [{ delta: { content: char } }],
          })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 8));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-AI-Provider': 'offline',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
