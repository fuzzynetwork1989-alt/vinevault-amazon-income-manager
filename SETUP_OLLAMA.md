# 🤖 Ollama Setup Guide for VineVault AI Assistant

## What is Ollama?

Ollama is a local AI platform that allows you to run large language models (like Mistral) on your own machine. This means:

- **No API costs** - completely free
- **Privacy** - your data never leaves your computer
- **Offline capability** - works without internet
- **Fast responses** - no network latency

## Installation

### Windows (Recommended)

1. Download from <https://ollama.ai/download>
2. Run the installer
3. Restart your computer
4. Open Command Prompt or PowerShell

### macOS

1. Download from <https://ollama.ai/download>
2. Install the .pkg file
3. Open Terminal

### Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Setup for VineVault

### Step 1: Install Mistral Model

```bash
ollama pull mistral
```

### Step 2: Start Ollama Server

```bash
ollama serve
```

@REM _Keep this terminal window open while using VineVault_

### Step 3: Verify Installation

```bash
ollama list
```

You should see `mistral` in the list.

## Testing Ollama

Test that Ollama is working:

```bash
ollama run mistral "What's a good strategy for Amazon Vine reviews?"
```

## Integration with VineVault

Once Ollama is running, the AI Assistant in VineVault will automatically connect to it. The backend is configured to connect to `http://localhost:11434` by default.

## Troubleshooting

### "Ollama not found" error

- Make sure Ollama is installed and added to your PATH
- Restart your terminal/command prompt
- Try running `ollama --version` to verify installation

### "AI service unavailable" error

- Make sure `ollama serve` is running in a separate terminal
- Check that port 11434 is not blocked by firewall
- Try restarting the Ollama server

### Slow responses

- Make sure you have enough RAM (8GB+ recommended)
- Close other applications to free up memory
- Consider using a smaller model if needed

## Advanced Options

### Using Different Models

```bash
# For faster responses (less capable)
ollama pull llama2

# For better reasoning (slower)
ollama mixtral
```

### Custom Model Configuration

You can edit the backend `.env` file to use different models:

```env
OLLAMA_MODEL=mistral  # Change this to use a different model
```

## Resource Requirements

- **RAM**: 8GB+ recommended (4GB minimum)
- **Storage**: 4GB+ for models
- **CPU**: Modern multi-core processor
- **GPU**: Optional but improves performance

## Security & Privacy

- All AI processing happens locally on your machine
- No data is sent to external servers
- Models are downloaded from trusted sources only
- Your prompts and responses are private

---

**Need help?** Check the official Ollama documentation at <https://github.com/ollama/ollama>
