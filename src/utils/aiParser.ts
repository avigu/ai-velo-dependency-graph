import OpenAI from 'openai';

export interface AINode {
  id: string;
  label: string;
  description: string;
  position: { x: number; y: number };
  type: 'function' | 'eventHandler' | 'pageElement' | 'wixApi' | 'externalAPI' | 'utility';
  group: string;
  data?: any;
}

export interface AIEdge {
  source: string;
  target: string;
  label: string;
}

export interface AIParseResult {
  nodes: AINode[];
  edges: AIEdge[];
}

const ANALYSIS_PROMPT = `You are analyzing a Velo by Wix code file to generate a logic and dependency graph, rendered using React Flow.

Your task is to extract meaningful functions and data flow, and output a simplified and clean JSON graph that visually represents only the relevant execution paths.

Please follow these rules:

1. Extract only functions and modules that are **actually used in the logic**.
   - If an import is unused, **do not include it** in the graph.

2. For each function, determine if it uses external services (e.g., APIs like worldtimeapi.org).
   - In that case, **describe the behavior clearly** in the function's node (\`description\`) instead of adding another node for the fetch utility.

3. Do **not include implementation helpers** (e.g., \`fetch\`, \`map\`, \`forEach\`, utility modules) as separate nodes unless they carry meaningful, standalone logic or data flow.

4. **Identify endpoints and starting points clearly**:
   - Mark entry points like \`onReady\`, event handlers, exported functions, or HTTP endpoints
   - Mark these as potential starting points of code execution flow
   - Use descriptive labels that indicate their role as entry points

5. Each node should contain:
   - \`id\`: unique identifier
   - \`label\`: function name or concept
   - \`description\`: short explanation of its purpose or external call, **clearly indicating if it's an entry point**
   - \`type\`: \`"function"\`, \`"eventHandler"\`, \`"externalAPI"\`, \`"pageElement"\`, \`"wixApi"\`, or \`"utility"\`
   - \`group\`: e.g., \`"Page Functions"\`, \`"Backend Functions"\`, \`"External Services"\`, \`"Entry Points"\`
   - \`position\`: \`{ "x": 0, "y": 0 }\` (layout will be handled later)

6. Only create edges that describe **actual logical flow or dependency** between two meaningful nodes (e.g., one function calls another).

7. Output the final result as a JSON object like this:

{
  "nodes": [
    {
      "id": "allZones",
      "label": "allZones",
      "description": "**[ENTRY POINT]** Exported backend function that fetches a list of time zones from worldtimeapi.org and formats them for dropdowns.",
      "type": "function",
      "group": "Backend Functions",
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "userTime",
      "label": "userTime",
      "description": "**[ENTRY POINT]** Exported backend function that fetches the current time for a specific time zone using worldtimeapi.org and extracts the hour.",
      "type": "function",
      "group": "Backend Functions",
      "position": { "x": 0, "y": 0 }
    }
  ],
  "edges": []
}

8. Add layout hints by ensuring \`group\` is assigned meaningfully, so the frontend can organize them in vertical columns or swimlanes.

Now analyze the following Velo code and return only the JSON:`;

export class AICodeAnalyzer {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async analyzeCode(code: string, filename?: string): Promise<AIParseResult> {
    console.group('🤖 AI Analysis');

    if (!this.openai || !this.apiKey) {
      throw new Error('OpenAI API key not provided. Please set your API key first.');
    }

    try {
      const prompt = `${ANALYSIS_PROMPT}\n\n\`\`\`javascript\n${code}\n\`\`\`${filename ? `\n\nFilename: ${filename}` : ''}`;
      
      console.log('📤 Sending request to OpenAI...');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      console.log('📥 AI Response received');

      // Parse the JSON response
      let result: AIParseResult;
      try {
        // Strip markdown code blocks if present
        let cleanContent = content.trim();
        
        // Remove ```json at the beginning
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.substring(7);
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.substring(3);
        }
        
        // Remove ``` at the end
        if (cleanContent.endsWith('```')) {
          cleanContent = cleanContent.substring(0, cleanContent.length - 3);
        }
        
        cleanContent = cleanContent.trim();
        
        result = JSON.parse(cleanContent) as AIParseResult;
        console.log('✅ JSON parsing successful');
        
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', parseError);
        throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }
      
      // Validate the structure
      if (!result.nodes || !result.edges) {
        throw new Error('Invalid response structure from AI');
      }

      // Add default values if missing
      result.nodes.forEach((node) => {
        if (!node.position) node.position = { x: 0, y: 0 };
        if (!node.type) node.type = 'utility';
        if (!node.group) node.group = 'Utilities';
      });

      result.edges.forEach((edge) => {
        if (!edge.label) edge.label = 'calls';
      });

      console.log(`✅ Analysis completed: ${result.nodes.length} nodes, ${result.edges.length} edges`);
      console.groupEnd();
      
      return result;

    } catch (error) {
      console.error('❌ AI analysis failed:', error instanceof Error ? error.message : 'Unknown error');
      console.groupEnd();
      
      // Return a fallback structure
      return {
        nodes: [
          {
            id: 'error',
            label: 'Analysis Error',
            description: `Failed to analyze code: ${error instanceof Error ? error.message : 'Unknown error'}`,
            position: { x: 0, y: 0 },
            type: 'utility' as const,
            group: 'Errors'
          }
        ],
        edges: []
      };
    }
  }

  isConfigured(): boolean {
    return this.apiKey !== null;
  }
}

// Export a singleton instance
export const aiAnalyzer = new AICodeAnalyzer(); 