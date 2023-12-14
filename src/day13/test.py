from itertools import product

def transpose(matrix):
    return [list(x[::-1]) for x in zip(*matrix)]

def is_perfect(pattern, i):
    return all(pattern[a] == pattern[b] for a, b in zip(range(i - 1, -1, -1), range(i + 2, len(pattern))))

def reflexions(pattern):
    for i in range(len(pattern) - 1):
        if pattern[i] == pattern[i + 1] and is_perfect(pattern, i):
            # print(i + 1)
            yield i + 1

def corrections(pattern):
    for i, j in product(range(len(pattern)), range(len(pattern[0]))):
        pattern2 = [row[:] for row in pattern]
        pattern2[i][j] = "#" if pattern2[i][j] == "." else "."
        yield pattern2

def correct(pattern):
    for pattern2 in corrections(pattern):
        for rfx in reflexions(pattern2):
            if rfx not in reflexions(pattern):
                print(rfx)
                return rfx

    return 0

def parse(file_name):
    return [[[z for z in y] for y in x.split("\n")] for x in open(file_name).read().strip().split("\n\n")]

def solve(file_name):
    # (print(reflexions(x)) for x in parse(file_name))
    # (print(reflexions(transpose(x))) for x in parse(file_name))
    return sum(sum(reflexions(transpose(x))) + 100 * sum(reflexions(x)) for x in parse(file_name))

def solve2(file_name):
    return sum(correct(transpose(x)) + 100 * correct(x) for x in parse(file_name))

# solve(f"inputs/{DAY}e1.txt") == 405
# print(solve(f"./input.txt"))
print(solve2(f"./input.txt"))
# assert solve2(f"inputs/{DAY}e1.txt") == 400
# assert solve2(f"inputs/{DAY}i.txt") == 25450