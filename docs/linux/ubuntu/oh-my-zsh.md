---
sidebar_position: 2
---

# Oh My Zsh

Oh My Zsh installation with Powerlevel10k theme.

![Oh My Zsh logo](https://ohmyz.sh/img/OMZLogo_BnW.png)

« [Oh My Zsh](https://ohmyz.sh/) is a community-driven framework for managing your Zsh configuration. It comes bundled with a ton of helpful functions, helpers, plugins, themes, and a few things that make you shout... ».

## Oh My Zsh

### Prerequisites

- [Zsh](https://www.zsh.org/) must be installed.
- [Curl](https://curl.se/) must be installed.

### Installation

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### Update

```bash
upgrade_oh_my_zsh
```

## Powerlevel10k theme

Powerlevel10k is a theme for Zsh. It emphasizes speed, flexibility and out-of-the-box experience.

![Powerlevel10k theme](https://raw.githubusercontent.com/romkatv/powerlevel10k-media/master/prompt-styles-high-contrast.png)

### Installation

With using Oh My Zsh, [you can install Powerlevel10k theme](https://github.com/romkatv/powerlevel10k#oh-my-zsh) with the following command:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

### Update

```bash
cd ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git pull
```

Then, you need to set `ZSH_THEME="powerlevel10k/powerlevel10k"` in your `~/.zshrc` and restart your terminal.

### Configuration

```bash
p10k configure
```

The configuration will be saved in the file `~/.p10k.zsh`.

## Bonus

On trick command to install Oh My Zsh and Powerlevel10k theme:

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
cd ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k && \
git pull
```
