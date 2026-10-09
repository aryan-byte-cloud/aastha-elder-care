import json
import re

with open('/Users/aryanmangeshbadhe/.gemini/antigravity/brain/1201233e-7344-472f-9e4c-3438a08ca719/.system_generated/steps/4/output.txt', 'r') as f:
    data = json.load(f)

design_md = data.get('designMd', '')
# Extract YAML block
yaml_block = design_md.split('---')[1]

import yaml

config = yaml.safe_load(yaml_block)

colors = config.get('colors', {})
typography = config.get('typography', {})
rounded = config.get('rounded', {})
spacing = config.get('spacing', {})

# We need to map this to tailwind config
# colors -> theme.extend.colors
# typography -> theme.extend.fontSize (and lineHeight, fontWeight, letterSpacing) using tailwind tuples: [fontSize, {lineHeight, letterSpacing, fontWeight}]
# rounded -> theme.extend.borderRadius
# spacing -> theme.extend.spacing

tailwind_colors = json.dumps(colors, indent=4)

tailwind_fontSize = {}
for key, val in typography.items():
    tailwind_fontSize[key] = [
        val.get('fontSize'),
        {
            'lineHeight': val.get('lineHeight'),
            'letterSpacing': val.get('letterSpacing'),
            'fontWeight': val.get('fontWeight')
        }
    ]

tailwind_font_size_json = json.dumps(tailwind_fontSize, indent=4)
tailwind_border_radius = json.dumps(rounded, indent=4)
tailwind_spacing = json.dumps(spacing, indent=4)

tailwind_config_content = f"""import type {{ Config }} from "tailwindcss";

const config: Config = {{
  content: [
    "./src/pages/**/*.{{js,ts,jsx,tsx,mdx}}",
    "./src/components/**/*.{{js,ts,jsx,tsx,mdx}}",
    "./src/app/**/*.{{js,ts,jsx,tsx,mdx}}",
  ],
  theme: {{
    extend: {{
      colors: {tailwind_colors},
      fontSize: {tailwind_font_size_json},
      borderRadius: {tailwind_border_radius},
      spacing: {tailwind_spacing},
    }},
  }},
  plugins: [],
}};
export default config;
"""

with open('tailwind.config.ts', 'w') as f:
    f.write(tailwind_config_content)

print("tailwind.config.ts generated")
