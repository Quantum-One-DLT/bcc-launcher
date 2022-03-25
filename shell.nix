{ pkgs ? import ./nix/nivpkgs.nix {} }:

with pkgs;

mkShell {
  buildInputs = [
    # javascript
    nodejs nodePackages.npm
    jq
    # documentation tools
    pandoc librsvg gnumake
  ] ++ lib.optional stdenv.isLinux mscgen ++ [
    # util to update nixpkgs pins
    niv
    # bcc-wallet sophie
    bcc-node
    bccWalletPackages.bcc-wallet
  ];

  # Test data from bcc-wallet repo used in their integration tests.
  TEST_CONFIG_SOPHIE = bccWalletPackages.src + /lib/sophie/test/data/bcc-node-sophie;

  # Corresponds to
  # https://hydra.tbco.io/job/Bcc/tbco-nix/bcc-deployment/latest/download/1/index.html
  BCC_NODE_CONFIGS = bccWalletPackages.bcc-node.deployments;
}
