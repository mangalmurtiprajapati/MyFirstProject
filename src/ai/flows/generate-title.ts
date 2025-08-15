
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a short, smart title from a longer piece of dialogue.
 * It exports the `generateTitle` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTitleInputSchema = z.object({
  dialogue: z.string().describe('The full dialogue to be summarized into a title.'),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

const GenerateTitleOutputSchema = z.object({
  title: z.string().describe('The generated short title (3-5 words).'),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;


export async function generateTitle(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
    return generateTitleFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateTitlePrompt',
    input: { schema: GenerateTitleInputSchema },
    output: { schema: GenerateTitleOutputSchema },
    prompt: `Generate a concise, smart title (3-5 words) for the following dialogue. The title should capture the essence of the text.

Dialogue: {{{dialogue}}}
`,
});


const generateTitleFlow = ai.defineFlow(
  {
    name: 'generateTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
