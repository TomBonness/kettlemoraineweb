import { routes } from './catalog'

export const inferenceLinks = {
  installer: 'https://github.com/satellitedown/fafstmobel-cinference',
  source: 'https://github.com/satellitedown/cinference',
  performance: 'https://github.com/satellitedown/cinference#performance',
  model: 'https://huggingface.co/satellitedown/fafstmobel',
  upstream: 'https://github.com/Neroued/ninfer',
} as const

export const inferenceNavigation = [
  { label: 'Speed', href: `${routes.inference}#speed` },
  { label: 'Engine', href: `${routes.inference}#engine` },
  { label: 'Install', href: `${routes.inference}#install` },
] as const

// Cinference README, overlapped GDN blocks: ninfer_bench decode after a 32,768-token prompt.
export const peakTokensPerSecond = 970.7

export const comparedEngines = ['llama.cpp', 'NInfer', 'Cinference Engine'] as const

// Measured 2026-09-30 on one RTX 5090 with the desktop running: one engine at a time, one request
// at a time, the same requests for every engine. Workloads come from cinference profiles/exp:
// the 16 sample_accept.py coding tasks (seeds 1 and 2) and the four edit_accept.py whole-file
// edits (seeds 7 and 8). Client decode rate, pooled over every block: llama.cpp 2 blocks,
// Cinference 3, NInfer 3 plus a partial one, alternated between 14:36 and 15:27.
// llama.cpp feb9a3d: unsloth Qwen3.8-27B UD-Q4_K_M, -ngl 99, no speculative decoding.
// NInfer 9e163ee and Cinference 383e5db (installer pin): fafstmobel, K8V4, DFlash2-15, proposal
// head; Cinference adds verify trees. NInfer loads revision 54202e1, whose Q8 drafter it supports.
export const engineComparison = [
  {
    name: 'Coding chats',
    detail: '16 coding tasks with reasoning, 1,024 tokens each',
    tokensPerSecond: { 'llama.cpp': 73.1, NInfer: 201.8, 'Cinference Engine': 290.3 },
  },
  {
    name: 'Whole-file edits',
    detail: 'Four source files rewritten in full',
    tokensPerSecond: { 'llama.cpp': 76.4, NInfer: 305.8, 'Cinference Engine': 535.2 },
  },
] as const

export const llamaCppSpeedup = Math.max(
  ...engineComparison.map(
    (workload) =>
      workload.tokensPerSecond['Cinference Engine'] / workload.tokensPerSecond['llama.cpp'],
  ),
)

export const comparisonAxisMax = 600

// Cinference README tables: ninfer_bench, greedy, 256 tokens after a 32,768-token prompt, K8V4,
// DFlash2-15. Commits b4e8ed4, 2d77e27, 785473a, bf3bd22 and e5ed41c.
export const speedHistory = [
  { date: 'Sep 23', label: 'First fafstmobel release', tokensPerSecond: 410.6 },
  { date: 'Sep 24', label: 'Rewritten verify kernels', tokensPerSecond: 535.8 },
  { date: 'Sep 28', label: 'Verify trees and prompt lookup', tokensPerSecond: 777.5 },
  { date: 'Sep 29', label: 'Lookup rounds', tokensPerSecond: 944.7 },
  { date: 'Sep 30', label: 'Overlapped GDN blocks', tokensPerSecond: 970.7 },
] as const

export const speedTechniques = [
  {
    title: 'Draft 15 tokens ahead.',
    description: 'A small DFlash2 drafter proposes the next 15 tokens. The 27B model checks a whole tree of proposals in one pass and keeps every token it agrees with.',
    icon: 'draft',
  },
  {
    title: 'Copy what’s already there.',
    description: 'When an answer repeats its context, like a file you asked it to edit, prompt lookup proposes that stretch directly. Near-certain matches skip drafting entirely.',
    icon: 'lookup',
  },
  {
    title: 'Hand-written for Blackwell.',
    description: 'Every verification round runs on custom CUDA kernels: FP8 and NVFP4 projections, warp-specialized K8V4 attention, and GDN blocks that overlap on a second stream.',
    icon: 'kernel',
  },
  {
    title: 'Same answers, sooner.',
    description: 'The full model checks every drafted token, so the output follows the model’s own distribution. The speed doesn’t cost you quality.',
    icon: 'verify',
  },
] as const

// Cinference README: peak decode (overlapped GDN table) and 8,192-token prefill (fifth kernel pass).
export const engineSpecs = [
  { label: 'Peak decode', value: '970', unit: 'tok/s' },
  { label: 'Drafted per round', value: '15', unit: 'tokens' },
  { label: 'Prompt processing', value: '9,416', unit: 'tok/s' },
  { label: 'Context window', value: '256K', unit: 'tokens' },
] as const

// Written token by token in the speed race; any code file works, since lanes replay measured rates.
export const raceFile = `"""Summarize per-kernel timings from an Nsight Systems CSV export.

Reads the cuda_gpu_trace report, groups launches by kernel name, and prints the
kernels that cost the most time as a table, CSV, or Markdown.
"""
import argparse
import csv
import statistics
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class KernelStats:
    kernel: str
    calls: int
    total_us: float
    median_us: float
    p90_us: float


def load_durations(path: Path) -> dict[str, list[float]]:
    """Map each kernel name to its launch durations in microseconds."""
    durations: dict[str, list[float]] = defaultdict(list)
    with path.open(newline="") as stream:
        for row in csv.DictReader(stream):
            if row.get("Name"):
                durations[row["Name"]].append(float(row["Duration (ns)"]) / 1000)
    if not durations:
        raise SystemExit(f"{path}: no kernel launches found")
    return durations


def summarize(durations: dict[str, list[float]]) -> list[KernelStats]:
    """Rank kernels by total time, most expensive first."""
    stats = []
    for name, values in durations.items():
        ordered = sorted(values)
        stats.append(
            KernelStats(
                kernel=name,
                calls=len(ordered),
                total_us=round(sum(ordered), 1),
                median_us=round(statistics.median(ordered), 2),
                p90_us=round(ordered[int(0.9 * (len(ordered) - 1))], 2),
            )
        )
    return sorted(stats, key=lambda item: item.total_us, reverse=True)


def print_table(stats: list[KernelStats]) -> None:
    total = sum(item.total_us for item in stats)
    print(f"{'total us':>12}  {'share':>6}  {'calls':>6}  {'p90 us':>9}  kernel")
    for item in stats:
        share = 100 * item.total_us / total
        print(f"{item.total_us:>12.1f}  {share:>5.1f}%  {item.calls:>6}  {item.p90_us:>9.2f}  {item.kernel}")


def print_markdown(stats: list[KernelStats]) -> None:
    print("| Kernel | Calls | Total (us) | Median (us) | p90 (us) |")
    print("|---|---:|---:|---:|---:|")
    for item in stats:
        print(f"| \`{item.kernel}\` | {item.calls} | {item.total_us:.1f} | {item.median_us:.2f} | {item.p90_us:.2f} |")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export", type=Path, help="CSV from nsys stats --report cuda_gpu_trace")
    parser.add_argument("--format", choices=("table", "csv", "markdown"), default="table")
    parser.add_argument("--top", type=int, default=20, help="number of kernels to show")
    args = parser.parse_args()

    stats = summarize(load_durations(args.export))[: args.top]
    if args.format == "csv":
        writer = csv.writer(sys.stdout)
        writer.writerow(["kernel", "calls", "total_us", "median_us", "p90_us"])
        for item in stats:
            writer.writerow([item.kernel, item.calls, item.total_us, item.median_us, item.p90_us])
    elif args.format == "markdown":
        print_markdown(stats)
    else:
        print_table(stats)
    return 0


if __name__ == "__main__":
    sys.exit(main())
`

// raceFile's length under the Qwen3.8 tokenizer (fafstmobel's tokenizer.json).
export const raceTokens = 886

export const installCommands = `git clone ${inferenceLinks.installer}.git
cd fafstmobel-cinference
bash setup.sh`

export const localEndpoint = {
  baseUrl: 'http://127.0.0.1:8001/v1',
  model: 'fafstmobel-cinference',
} as const

export const inferenceSignup = {
  source: 'cinference-engine-product',
  heading: 'Get the next speed record.',
  lead: 'We ship Cinference Engine speed passes every few days. Leave your email and we’ll tell you when it gets faster.',
  submit: 'Get updates',
  success: 'You’re on the list. We’ll email you when Cinference Engine gets faster.',
  privacy: 'Release updates only. Kettle Moraine Research Labs stores your email solely for Cinference Engine release notes until the release notes program ends.',
} as const
