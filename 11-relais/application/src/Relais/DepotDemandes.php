<?php

namespace App\Relais;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * État des demandes, gardé dans la session de l'utilisateur.
 * Une session neuve part de data/demandes-depart.json.
 */
final class DepotDemandes
{
    private const CLE = 'relais.demandes';

    public function __construct(
        private readonly RequestStack $requestStack,
        #[Autowire('%kernel.project_dir%/data/demandes-depart.json')]
        private readonly string $fichierDepart,
    ) {
    }

    /** @return array<string, array{id: string, objet: string, statut: string, technicien: ?string, relecteur: ?string}> */
    public function toutes(): array
    {
        $session = $this->requestStack->getSession();
        if (!$session->has(self::CLE)) {
            $session->set(self::CLE, $this->depart());
        }

        return $session->get(self::CLE);
    }

    /** @return array{id: string, objet: string, statut: string, technicien: ?string, relecteur: ?string}|null */
    public function trouver(string $id): ?array
    {
        return $this->toutes()[$id] ?? null;
    }

    public function changerStatut(string $id, string $statut): void
    {
        $demandes = $this->toutes();
        $demandes[$id]['statut'] = $statut;
        $this->requestStack->getSession()->set(self::CLE, $demandes);
    }

    /** @return array<string, array{id: string, objet: string, statut: string, technicien: ?string, relecteur: ?string}> */
    private function depart(): array
    {
        $liste = json_decode((string) file_get_contents($this->fichierDepart), true, 512, JSON_THROW_ON_ERROR);
        $demandes = [];
        foreach ($liste as $demande) {
            $demandes[$demande['id']] = $demande;
        }

        return $demandes;
    }
}
