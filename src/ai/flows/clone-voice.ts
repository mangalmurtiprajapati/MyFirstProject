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
      "A 1-2 minute audio sample of the voice to be cloned, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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

const prompt = ai.definePrompt({
  name: 'cloneVoicePrompt',
  input: {schema: CloneVoiceInputSchema},
  output: {schema: CloneVoiceOutputSchema},
  prompt: `You are an expert voice cloning AI.

You will take the provided audio sample and create a text-to-speech voice model that sounds like the person in the sample.

The user has named this voice "{{voiceName}}".

Return the voice model and the voice name.

Audio Sample: {{media url=audioSampleDataUri}}`,
});

const cloneVoiceFlow = ai.defineFlow(
  {
    name: 'cloneVoiceFlow',
    inputSchema: CloneVoiceInputSchema,
    outputSchema: CloneVoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Add the voiceName to the output since the prompt might not return it reliably.
    return { ...output!, voiceName: input.voiceName };
  }
);
