'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a unique synthetic voice.
 *
 * The flow allows users to specify parameters like tone, pitch, and style to create a distinct voice for their content.
 * It exports the `generateSyntheticVoice` function, the `GenerateSyntheticVoiceInput` type, and the `GenerateSyntheticVoiceOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateSyntheticVoiceInputSchema = z.object({
  dialogue: z.string().describe('The dialogue to be converted to voice.'),
});
export type GenerateSyntheticVoiceInput = z.infer<
  typeof GenerateSyntheticVoiceInputSchema
>;

const GenerateSyntheticVoiceOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The generated synthetic voice audio data as a data URI (WAV format).'
    ),
});
export type GenerateSyntheticVoiceOutput = z.infer<
  typeof GenerateSyntheticVoiceOutputSchema
>;

export async function generateSyntheticVoice(
  input: GenerateSyntheticVoiceInput
): Promise<GenerateSyntheticVoiceOutput> {
  return generateSyntheticVoiceFlow(input);
}

const generateSyntheticVoiceFlow = ai.defineFlow(
  {
    name: 'generateSyntheticVoiceFlow',
    inputSchema: GenerateSyntheticVoiceInputSchema,
    outputSchema: GenerateSyntheticVoiceOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
      },
      prompt: `Please say the following in Hindi: ${input.dialogue}`,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
