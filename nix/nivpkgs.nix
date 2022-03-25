{ sources ? import ./sources.nix }:
with
  { overlay = self: pkgs:
      {
        bccWalletPackages = import sources.bcc-wallet { gitrev = sources.bcc-wallet.rev; };
      } // (if (sources ? bcc-node) then {
        # Use bcc-node override.
        bccNodePackages = builtins.trace
          "Note: using bcc-node from bcc-launcher/nix/sources.json"
          (import (sources.bcc-node) {});
        inherit (self.bccNodePackages) bcc-node;
      } else {
        # Normally, bcc-wallet should pick the bcc-node version.
        inherit (self.bccWalletPackages) bcc-node;
      });
  };
import sources.nixpkgs
  { overlays = [ overlay ] ; config = {}; }
