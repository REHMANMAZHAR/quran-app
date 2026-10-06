"""Rebuild every data file in the right order:  python scripts/build_all.py"""
import os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
for step in ["build.py", "build_learn.py", "build_extras.py", "build_indopak.py", "audit_wbw.py", "bundle_single.py"]:
    print(f"== {step}"); subprocess.run([sys.executable, os.path.join(D, step)], check=True)
