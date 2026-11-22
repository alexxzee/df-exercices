<?php

namespace App\Relais;

final class Transitions
{
    private const DESTINATIONS = [
        'demarrer' => 'en_cours',
        'envoyer_en_revue' => 'en_revue',
        'terminer' => 'terminee',
        'renvoyer' => 'en_cours',
    ];

    /**
     * Transitions permises pour un acteur sur une demande.
     *
     * @return list<string>
     */
    public static function permises(string $statut, ?string $acteur, ?string $technicien, ?string $relecteur): array
    {
        if ($acteur === null) {
            return [];
        }

        return match ($statut) {
            'ouverte' => $technicien !== null && $acteur === $technicien ? ['demarrer'] : [],
            'en_cours' => $acteur === $technicien && $relecteur !== null && $relecteur !== $technicien ? ['envoyer_en_revue'] : [],
            'en_revue' => self::peutTerminer($acteur, $relecteur) ? ['terminer', 'renvoyer'] : [],
            default => [],
        };
    }

    /**
     * Qui peut terminer ou renvoyer une demande en revue.
     */
    private static function peutTerminer(string $acteur, ?string $relecteur): bool
    {
        return $relecteur !== null && $acteur === $relecteur;
    }

    /**
     * Raisons pour lesquelles une demande ne peut pas avancer, quel que soit l'acteur.
     *
     * @return list<string>
     */
    public static function blocages(string $statut, ?string $technicien, ?string $relecteur): array
    {
        return match (true) {
            $statut === 'ouverte' && $technicien === null => ['sans_technicien'],
            $statut === 'en_cours' && $relecteur !== null && $relecteur === $technicien => ['relecteur_identique'],
            default => [],
        };
    }

    public static function destination(string $transition): string
    {
        return self::DESTINATIONS[$transition] ?? throw new \InvalidArgumentException('Transition inconnue : '.$transition);
    }
}
