
'use server';

/**
 * @fileOverview Clones a voice from a user-provided audio sample.
 *
 * - cloneVoice - A function that handles the voice cloning process.
 * - CloneVoiceInput - The input type for the cloneVoice function.
 * - CloneVoiceOutput - The return type for the cloneVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CloneVoiceInputSchema = z.object({
  audioSampleDataUri: z
    .string()
    .describe(
      "A 1-2 minute audio sample of the voice to be cloned, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  voiceName: z.string().describe('The name for the cloned voice.'),
});
export type CloneVoiceInput = z.infer<typeof CloneVoiceInputSchema>;

const CloneVoiceOutputSchema = z.object({
  clonedVoiceModel: z.string().describe('The cloned voice model in text-to-speech format.'),
  voiceName: z.string().describe('The name of the cloned voice.'),
});
export type CloneVoiceOutput = z.infer<typeof CloneVoiceOutputSchema>;

export async function cloneVoice(input: CloneVoiceInput): Promise<CloneVoiceOutput> {
  return cloneVoiceFlow(input);
}

// NOTE: True voice cloning from a sample is a complex process that would require a dedicated
// service or a model specifically trained for that task. The current Genkit/Gemini setup
// does not support creating new TTS voices from an audio file directly.
// This flow simulates the process by returning a randomly selected pre-existing voice.
const cloneVoiceFlow = ai.defineFlow(
  {
    name: 'cloneVoiceFlow',
    inputSchema: CloneVoiceInputSchema,
    outputSchema: CloneVoiceOutputSchema,
  },
  async (input) => {
    const supportedVoices = [
        "algenib", "achernar", "gacrux", "schedar", "zubenelgenubi", 
        "vindemiatrix", "achird", "alnilam", "aoede", "autonoe", 
        "callirrhoe", "charon", "despina", "enceladus", "erinome", 
        "fenrir", "iapetus", "kore", "laomedeia", "leda", "orus", 
        "puck", "pulcherrima", "rasalgethi", "sadachbia", "sadaltager", "sulafat", "umbriel"
    ];

    // Select a random voice from the list to simulate a new cloned voice
    const randomVoice = supportedVoices[Math.floor(Math.random() * supportedVoices.length)];

    return {
      clonedVoiceModel: randomVoice,
      voiceName: input.voiceName,
    };
  }
);
