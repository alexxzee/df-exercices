<?php

use App\Relais\Transitions;
use PHPUnit\Framework\TestCase;

/**
 * Tests des règles du ticket RL-12 (tickets/RL-12.md), sur la classe Transitions.
 * Acteurs des données de départ : Nadia (technicienne), Paul (relecteur), Hugo (autre membre).
 */
final class TransitionsTest extends TestCase
{
    private const CORRIGER = ' Corrige src/Relais/Transitions.php, pas ce test.';

    public function testSansActeurAucuneTransition(): void
    {
        foreach (['ouverte', 'en_cours', 'en_revue', 'terminee', 'abandonnee'] as $statut) {
            self::assertSame([], Transitions::permises($statut, null, 'Nadia', 'Paul'),
                'RL-12 : sans acteur connu, aucune transition.'.self::CORRIGER);
        }
    }

    public function testR1SansTechnicienPersonneNeDemarre(): void
    {
        foreach (['Nadia', 'Paul', 'Hugo'] as $acteur) {
            self::assertSame([], Transitions::permises('ouverte', $acteur, null, null),
                'R1 (RL-12) : une demande sans technicien ne démarre pas.'.self::CORRIGER);
        }
        self::assertSame(['sans_technicien'], Transitions::blocages('ouverte', null, null),
            'R1 (RL-12) : le blocage sans_technicien est attendu.'.self::CORRIGER);
        self::assertSame([], Transitions::blocages('ouverte', 'Nadia', 'Paul'),
            'R1 (RL-12) : aucun blocage quand un technicien est assigné.'.self::CORRIGER);
        self::assertSame(['demarrer'], Transitions::permises('ouverte', 'Nadia', 'Nadia', 'Paul'),
            'R1 (RL-12) : le technicien assigné démarre la demande.'.self::CORRIGER);
        self::assertSame([], Transitions::permises('ouverte', 'Hugo', 'Nadia', 'Paul'),
            'R1 (RL-12) : seul le technicien assigné démarre la demande.'.self::CORRIGER);
    }

    public function testR2RelecteurIdentiquePasDEnvoiEnRevue(): void
    {
        self::assertSame([], Transitions::permises('en_cours', 'Nadia', 'Nadia', 'Nadia'),
            'R2 (RL-12) : le relecteur doit être une autre personne que le technicien.'.self::CORRIGER);
        self::assertSame(['relecteur_identique'], Transitions::blocages('en_cours', 'Nadia', 'Nadia'),
            'R2 (RL-12) : le blocage relecteur_identique est attendu.'.self::CORRIGER);
        self::assertSame(['envoyer_en_revue'], Transitions::permises('en_cours', 'Nadia', 'Nadia', 'Paul'),
            'R2 (RL-12) : le technicien assigné envoie la demande en revue.'.self::CORRIGER);
        self::assertSame([], Transitions::permises('en_cours', 'Hugo', 'Nadia', 'Paul'),
            'R2 (RL-12) : seul le technicien assigné envoie la demande en revue.'.self::CORRIGER);
        self::assertSame([], Transitions::permises('en_cours', 'Nadia', 'Nadia', null),
            'R2 (RL-12) : sans relecteur, la demande ne part pas en revue.'.self::CORRIGER);
        self::assertSame([], Transitions::blocages('en_cours', 'Nadia', 'Paul'),
            'R2 (RL-12) : aucun blocage quand le relecteur est une autre personne.'.self::CORRIGER);
    }

    public function testR3LeRelecteurTermine(): void
    {
        self::assertContains('terminer', Transitions::permises('en_revue', 'Paul', 'Nadia', 'Paul'),
            'R3 (RL-12) : le relecteur termine la demande en revue.'.self::CORRIGER);
        self::assertSame('terminee', Transitions::destination('terminer'),
            'R3 (RL-12) : terminer mène au statut terminee.'.self::CORRIGER);
    }

    public function testR4LeRelecteurRenvoieEnCours(): void
    {
        self::assertSame(['terminer', 'renvoyer'], Transitions::permises('en_revue', 'Paul', 'Nadia', 'Paul'),
            'R4 (RL-12) : le relecteur peut aussi renvoyer la demande au technicien.'.self::CORRIGER);
        self::assertSame('en_cours', Transitions::destination('renvoyer'),
            'R4 (RL-12) : renvoyer ramène la demande en cours.'.self::CORRIGER);
    }

    public function testR5AucuneTransitionApresLaFin(): void
    {
        foreach (['terminee', 'abandonnee'] as $statut) {
            foreach (['Nadia', 'Paul', 'Hugo'] as $acteur) {
                self::assertSame([], Transitions::permises($statut, $acteur, 'Nadia', 'Paul'),
                    'R5 (RL-12) : aucune transition après la fin.'.self::CORRIGER);
            }
            self::assertSame([], Transitions::blocages($statut, 'Nadia', 'Nadia'),
                'R5 (RL-12) : aucun blocage après la fin.'.self::CORRIGER);
        }
    }

    public function testTransitionInconnueRefusee(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Transition inconnue : fermer');

        Transitions::destination('fermer');
    }

    // Emplacement de l'exercice 2 : collez ici la méthode donnée par la fiche.
}
