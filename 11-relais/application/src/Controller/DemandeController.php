<?php

namespace App\Controller;

use App\Relais\DepotDemandes;
use App\Relais\Transitions;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

final class DemandeController extends AbstractController
{
    private const ACTEURS = ['assigne', 'relecteur', 'autre'];

    private const AUTRE_MEMBRE = 'Hugo';

    public function __construct(private readonly DepotDemandes $depot)
    {
    }

    #[Route('/', name: 'accueil', methods: ['GET'])]
    public function accueil(): RedirectResponse
    {
        return $this->redirectToRoute('demande_liste');
    }

    #[Route('/demandes', name: 'demande_liste', methods: ['GET'])]
    public function liste(): Response
    {
        return $this->render('demande/index.html.twig', [
            'demandes' => $this->depot->toutes(),
        ]);
    }

    #[Route('/demandes/{id}', name: 'demande_voir', methods: ['GET'])]
    public function voir(string $id, Request $request): Response
    {
        $demande = $this->demande($id);
        $acteur = $this->acteur($request->query->getString('acteur'));

        return $this->render('demande/show.html.twig', [
            'demande' => $demande,
            'acteur' => $acteur,
            'transitions' => $this->permises($demande, $acteur),
            'blocages' => Transitions::blocages($demande['statut'], $demande['technicien'], $demande['relecteur']),
        ]);
    }

    #[Route('/demandes/{id}/transition', name: 'demande_transition', methods: ['POST'])]
    public function transition(string $id, Request $request): Response
    {
        $demande = $this->demande($id);
        $acteur = $this->acteur($request->request->getString('acteur'));
        $transition = $request->request->getString('transition');

        if (!in_array($transition, $this->permises($demande, $acteur), true)) {
            return new Response('Action refusée.', Response::HTTP_FORBIDDEN);
        }

        $this->depot->changerStatut($id, Transitions::destination($transition));

        return $this->redirectToRoute('demande_voir', ['id' => $id, 'acteur' => $acteur]);
    }

    /** @return array{id: string, objet: string, statut: string, technicien: ?string, relecteur: ?string} */
    private function demande(string $id): array
    {
        return $this->depot->trouver($id) ?? throw new NotFoundHttpException('Demande inconnue.');
    }

    private function acteur(string $valeur): string
    {
        return in_array($valeur, self::ACTEURS, true) ? $valeur : 'autre';
    }

    /**
     * @param array{statut: string, technicien: ?string, relecteur: ?string} $demande
     *
     * @return list<string>
     */
    private function permises(array $demande, string $acteur): array
    {
        $personne = match ($acteur) {
            'assigne' => $demande['technicien'],
            'relecteur' => $demande['relecteur'],
            default => self::AUTRE_MEMBRE,
        };

        return Transitions::permises($demande['statut'], $personne, $demande['technicien'], $demande['relecteur']);
    }
}
