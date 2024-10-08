import random
import string

def make_key(length=5):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def pair_players(participants):
    random.shuffle(participants)
    pairs = []
    for i in range(0, len(participants), 2):
        if i + 1 < len(participants):
            pairs.append((participants[i], participants[i + 1]))
    return pairs