import argparse
import math

# constants
INDEX_ERROR = -1
ACCEPTABLE_ERROR = 0.05

TESTS = [
    # table 1
    {"hosts": (1, 1, 1, 1, 1), "rank": 1, "index": 0},
    {"hosts": (10, 1, 1, 1, 1), "rank": 10, "index": 1},
    {"hosts": (100, 1, 1, 1, 1), "rank": 100, "index": 2},
    {"hosts": (1000, 1, 1, 1, 1), "rank": 1000, "index": 3},
    {"hosts": (55, 11, 1, 1, 1), "rank": 10000, "index": 4},
    {"hosts": (565, 106, 1, 1, 1), "rank": 100000, "index": 5},
    {"hosts": (455, 297, 3, 1, 1), "rank": 1000000, "index": 6},
    {"hosts": (877, 283, 28, 1, 1), "rank": 10000000, "index": 7},
    {"hosts": (778, 114, 97, 1, 1), "rank": 31622777, "index": 7.5},
    {"hosts": (944, 41, 28, 3, 1), "rank": 100000000, "index": 8},
    {"hosts": (906, 96, 20, 8, 1), "rank": 316227766, "index": 8.5},
    {"hosts": (325, 171, 41, 25, 1), "rank": 1000000000, "index": 9},
    {"hosts": (633, 178, 122, 18, 2), "rank": 3162277660, "index": 9.5},
    {"hosts": (573, 120, 38, 16, 5), "rank": 10000000000, "index": 10},
    {"hosts": (1000, 500, 150, 75, 5), "rank": 11795988501, "index": 10.07173434},
    
    # table 2
    # allocreadiidae
    {"hosts": (39, 28, 12, 9, 1), "rank": 355973905, "index": 8.5514},
    {"hosts": (100, 41, 20, 15, 2), "rank": 3011437755, "index": 9.4787},
    # hemiuridae
    {"hosts": (4, 4, 4, 3, 1), "rank": 90953349, "index": 7.9588},
    {"hosts": (20, 16, 11, 8, 1), "rank": 312908085, "index": 8.4954},
    {"hosts": (50, 28, 16, 10, 2), "rank": 2803855722, "index": 9.4477},
    {"hosts": (5, 4, 4, 2, 1), "rank": 45665799, "index": 7.6595},
    {"hosts": (7, 7, 4, 1, 1), "rank": 1125740, "index": 6.0514},
    {"hosts": (4, 4, 3, 1, 1), "rank": 750499, "index": 5.8753},
    {"hosts": (29, 24, 13, 6, 1), "rank": 227158274, "index": 8.3563},
    {"hosts": (4, 3, 2, 2, 1), "rank": 45664801, "index": 7.6595},
    {"hosts": (2, 2, 2, 2, 1), "rank": 45663801, "index": 7.6595},
    {"hosts": (20, 15, 8, 6, 2), "rank": 2629434956, "index": 9.4198},
]

GREEN = "\033[32m"
RED = "\033[31m"
YELLOW = "\033[33m"
RESET = "\033[0m"

# default maxima for number of species, genera, and families
n_species = 1000
n_genera = 500
n_families = 150
n_orders = 75
n_classes = 5

# functions
def calc_host_index(host_species: int, host_genera: int, host_families: int, host_orders: int, host_classes: int) -> float:
    value = 0
    
    host_species, host_genera, host_families, host_orders, host_classes = validate_input(host_species, host_genera, host_families, host_orders, host_classes)
    
    if host_classes > 1:
        value = calc_host_index(n_species, n_genera, n_families, n_orders, host_classes - 1)
        f_index = calc_host_index(host_species, host_genera, host_families, host_orders, 1)
        o_index = calc_host_index(host_classes, host_classes, host_classes, host_classes, 1)
        value += f_index - o_index + 1
    elif host_orders > 1:
        value = calc_host_index(n_species, n_genera, n_families, host_orders - 1, 1)
        f_index = calc_host_index(host_species, host_genera, host_families, 1, 1)
        o_index = calc_host_index(host_orders, host_orders, host_orders, 1, 1)
        value += f_index - o_index + 1
    elif host_families > 1:
        value = calc_host_index(n_species, n_genera, host_families - 1, 1, 1)
        f_index = calc_host_index(host_species, host_genera, 1, 1, 1)
        o_index = calc_host_index(host_families, host_families, 1, 1, 1)
        value += f_index - o_index + 1
    elif host_genera > 1:
        for g in range(1, host_genera):
            value += n_species - g + 1
        value += host_species - host_genera + 1
    else: 
        value = host_species
    
    return value

def validate_input(host_species: int, host_genera: int, host_families: int, host_orders: int, host_classes: int) -> (int):
    if host_species > n_species:
        host_species = n_species
    elif host_genera > n_genera:
        host_genera = n_genera
    elif host_families > n_families:
        host_families = n_families
    elif host_orders > n_orders:
        host_orders = n_orders
    elif host_classes > n_classes:
        host_classes = n_classes
        
    if host_orders < host_classes:
        host_orders = host_classes
    if host_families < host_orders:
        host_families = host_orders
    if host_genera < host_families:
        host_genera = host_families
    if host_species < host_genera:
        host_species = host_genera
        
    return (host_species, host_genera, host_families, host_orders, host_classes)

def calc(host_species: int, host_genera: int, host_families: int, host_orders: int, host_classes: int) -> float:
    return calc_host_index(host_species, host_genera, host_families, host_orders, host_classes)
    # return math.log10(idx)    


def calc_test_error(desired_val: float, test_val: float):
    if desired_val == 0:
        return abs(test_val - desired_val)
    return abs(test_val - desired_val) / desired_val

def print_test_header():
    print("\n" + " " * 33 + "Hosts" +  " " * 44 + "Rank" +  " " * 26 + "Index (HS)")
    print(" " * 6 + "-" * 126)
    print(
        "%-5s |  %-10s %-9s %-11s %-9s %-8s |  %11s %12s %8s  |  %-11s %-9s %-6s |  %-1s"
        % ("Test", "Species", "Genera", "Families", "Orders", "Classes", "Expected", "Actual", "Error", "Expected", "Actual", "Error", "Pass")
    )

    print("-" * 138)

def run_tests():
    print_test_header()
    pass_count = 0
    for i, test in enumerate(TESTS):
        species, genera, families, orders, classes = test.get("hosts")
        
        expected_index = test.get("index")
        expected_rank = test.get("rank")
        
        test_rank = calc(*test.get('hosts'))
        test_index = math.log10(test_rank)
        
        err_rank = calc_test_error(test.get('rank'), test_rank)
        err_index = calc_test_error(test.get('index'), test_index)

        passed = "✅" if err_rank <= ACCEPTABLE_ERROR and err_index <= ACCEPTABLE_ERROR else "❌"
        if err_rank <= ACCEPTABLE_ERROR and err_index <= ACCEPTABLE_ERROR:
            pass_count += 1

        print(
            "%-5d |  %-10d %-9d %-11d %-9d %-8d |  %11d  %11d %8.3f  |  %-11.3f %-9.4f %-6.3f |  %-1s"
            % (i, species, genera, families, orders, classes, expected_rank, test_rank, err_rank, expected_index, test_index, err_index, passed)
        )
        
    pass_percent = pass_count / len(TESTS)
    color = GREEN if pass_percent == 1 else YELLOW if pass_percent >= 0.75 else RED
    
    print(f"\n{color}Passed {pass_count}/{len(TESTS)}{RESET}\n")

def main():
    parser = argparse.ArgumentParser(prog="Specificity", description="Calculate the index and rank of host specificity.")
    
    parser.add_argument("--species", "-s", type=int, required=False, help="Number of host species")
    parser.add_argument("--genera", "-g", type=int, required=False, help="Number of host genera")
    parser.add_argument("--families", "-f", type=int, required=False, help="Number of host families")
    parser.add_argument("--orders", "-o", type=int, required=False, help="Number of host orders")
    parser.add_argument("--classes", "-c", type=int, required=False, help="Number of host classes")
    
    parser.add_argument("--test", action="store_true", help="Run built-in test suite")
    
    args = parser.parse_args()
    
    if args.test:
        run_tests()
        return
    
    required = ["species", "genera", "families", "orders", "classes"]
    missing = [r for r in required if getattr(args, r) is None]

    if missing:
        parser.error(f"Missing required arguments: {', '.join('--' + m for m in missing)}")
        return
    
    host_rank = calc(args.species, args.genera, args.families, args.orders, args.classes)
    host_index = math.log10(host_rank)
    
    print(f"rank:  {host_rank}\nindex: {host_index}")
    
if __name__ == "__main__":
    main()
    